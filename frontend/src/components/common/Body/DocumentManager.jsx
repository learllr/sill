import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../../../axiosConfig.js";
import DetailContainer from "../../common/Body/DetailContainer.jsx";
import ItemContainer from "../../common/Body/ItemContainer.jsx";
import Section from "../../common/Body/Section.jsx";
import NavigationTabs from "../../common/Buttons/NavigationTabs.jsx";
import Loading from "./Design/Loading.jsx";

export default function DocumentManager({
  title,
  selectedMainTab,
  setSelectedMainTab,
  selectedSubTab = null,
  setSelectedSubTab = null,
  menuItems,
}) {
  const queryClient = useQueryClient();
  const currentMenu = menuItems.find((item) => item.label === selectedMainTab);
  const currentSubMenu = currentMenu?.subMenu || [];

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [error, setError] = useState("");

  const {
    data: documents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents", selectedMainTab, selectedSubTab],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `/document/type/${encodeURIComponent(selectedMainTab)}`
        );
        return response.data.documents;
      } catch (error) {
        console.error("Erreur lors de la récupération des documents :", error);
        throw new Error("Erreur lors du chargement des documents.");
      }
    },
    enabled: !!selectedMainTab,
  });

  const addMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "documents",
        selectedMainTab,
        selectedSubTab,
      ]);
      setIsDetailVisible(false);
      setSelectedDocument(null);
    },
    onError: () => {
      setError("Erreur lors de l'ajout du document.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId) => {
      await axios.delete(`/document/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "documents",
        selectedMainTab,
        selectedSubTab,
      ]);
      setIsDetailVisible(false);
      setSelectedDocument(null);
    },
    onError: () => {
      setError("Erreur lors de la suppression du document.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ documentId, formData }) => {
      const response = await axios.put(`/document/${documentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "documents",
        selectedMainTab,
        selectedSubTab,
      ]);
      setIsDetailVisible(false);
      setSelectedDocument(null);
    },
    onError: () => {
      setError("Erreur lors de la modification du document.");
    },
  });

  return (
    <div>
      <Section title={title} />

      <NavigationTabs
        menuItems={menuItems.map((item) => item.label)}
        onTabChange={(tab) => {
          setSelectedMainTab(tab);
          if (setSelectedSubTab) {
            const newSubMenu =
              menuItems.find((item) => item.label === tab)?.subMenu || [];
            setSelectedSubTab(newSubMenu.length ? newSubMenu[0] : "");
          }
        }}
        selectedTab={selectedMainTab}
      />

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex space-x-2">
        <div className={isDetailVisible ? "w-2/3" : "w-full"}>
          {isLoading && <Loading />}
          {isError && <p>Erreur lors du chargement des documents.</p>}
          {!isLoading && !isError && (
            <ItemContainer
              items={documents || []}
              subMenuItems={currentSubMenu}
              selectedSubTab={selectedSubTab}
              setSelectedSubTab={setSelectedSubTab}
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
              onClose={() => {
                setIsDetailVisible(false);
                setSelectedDocument(null);
                queryClient.invalidateQueries([
                  "documents",
                  selectedMainTab,
                  selectedSubTab,
                ]);
              }}
              isNew={isAddingNew}
              documentType={selectedMainTab}
              document={selectedDocument}
              onAdd={(formData) => addMutation.mutate(formData)}
              isAdding={addMutation.isLoading}
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
