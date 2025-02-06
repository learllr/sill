import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "../../../axiosConfig.js";
import NavigationTabs from "../../common/Buttons/NavigationTabs.jsx";
import Section from "../../common/Body/Section.jsx";
import { bankMenuItems } from "../../../../../shared/constants/menuItems.js";
import ItemContainer from "../../common/Body/ItemContainer.jsx";
import DetailContainer from "../../common/Body/DetailContainer.jsx";
import { DocumentType } from "../../../../../shared/constants/types.js";

const fetchDocumentsByType = async (typeName) => {
  const response = await axios.get(
    `/document/type/${encodeURIComponent(typeName)}`
  );
  return response.data.documents;
};

export default function Bank() {
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(
    DocumentType.RELEVES_DE_COMPTES
  );
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const {
    data: documents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents", selectedTab],
    queryFn: () => fetchDocumentsByType(selectedTab),
    enabled: !!selectedTab,
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
            />
          </div>
        )}
      </div>
    </div>
  );
}
