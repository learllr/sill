import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "../../../axiosConfig.js";
import NavigationTabs from "../../common/Buttons/NavigationTabs.jsx";
import Section from "../../common/Body/Section.jsx";
import { bankMenuItems } from "../../../../../shared/constants/menuItems.js";
import ItemContainer from "../../common/Body/ItemContainer.jsx";
import DetailContainer from "../../common/Body/DetailContainer.jsx";
import { DocumentType } from "../../../../../shared/constants/types.js";

export default function Bank() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(
    DocumentType.RELEVES_DE_COMPTES
  );
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [error, setError] = useState("");

  // Récupération des documents
  const {
    data: documents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents", selectedTab],
    queryFn: async () => {
      const response = await axios.get(
        `/document/type/${encodeURIComponent(selectedTab)}`
      );
      return response.data.documents;
    },
    enabled: !!selectedTab,
  });

  // Suppression d'un document
  const deleteMutation = useMutation({
    mutationFn: async (documentId) => {
      await axios.delete(`/document/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents", selectedTab]);
      setIsDetailVisible(false);
      setSelectedDocument(null);
    },
    onError: () => {
      setError("Erreur lors de la suppression du document.");
    },
  });

  // Modification d'un document
  const updateMutation = useMutation({
    mutationFn: async ({ documentId, formData }) => {
      const response = await axios.put(`/document/${documentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents", selectedTab]);
      setIsDetailVisible(false);
      setSelectedDocument(null);
    },
    onError: () => {
      setError("Erreur lors de la modification du document.");
    },
  });

  const handleDocumentAdded = () => {
    setIsDetailVisible(false);
    setSelectedDocument(null);
    queryClient.invalidateQueries(["documents", selectedTab]);
  };

  return (
    <div>
      <Section title="Banque" />
      <NavigationTabs menuItems={bankMenuItems} onTabChange={setSelectedTab} />

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex space-x-2">
        <div className={isDetailVisible ? "w-2/3" : "w-full"}>
          {isLoading && <p>Chargement...</p>}
          {isError && <p>Erreur lors du chargement des documents.</p>}
          {!isLoading && !isError && (
            <ItemContainer
              items={documents || []}
              onAdd={() => {
                setIsDetailVisible(true);
                setIsAddingNew(true);
                setSelectedDocument(null);
              }}
              onSelectItem={(document) => {
                setIsDetailVisible(true);
                setIsAddingNew(false);
                setSelectedDocument(document);
              }}
            />
          )}
        </div>

        {isDetailVisible && (
          <div className="w-1/3">
            <DetailContainer
              onClose={handleDocumentAdded}
              isNew={isAddingNew}
              documentType={selectedTab}
              document={selectedDocument}
              onDelete={(documentId) => deleteMutation.mutate(documentId)}
              isDeleting={deleteMutation.isLoading}
              onUpdate={(documentId, formData) =>
                updateMutation.mutate({ documentId, formData })
              }
              isUpdating={updateMutation.isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
