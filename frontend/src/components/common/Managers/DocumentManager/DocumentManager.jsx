import React, { useState } from "react";
import { useDocuments } from "../../../../hooks/useDocuments.jsx";
import { useParticipants } from "../../../../hooks/useParticipants.jsx";
import NavigationTabs from "../../Design/Buttons/NavigationTabs.jsx";
import Loading from "../../Design/Loading.jsx";
import Section from "../Section.jsx";
import DetailContainer from "./DetailContainer.jsx";
import ItemContainer from "./ItemContainer.jsx";

export default function DocumentManager({
  title,
  selectedMainTab,
  setSelectedMainTab,
  selectedSubTab = null,
  setSelectedSubTab = null,
  menuItems,
  employeeId = null,
  documentScope = "main",
  ContactInfoComponent = null,
  participantId = null,
  projectId = null,
  inParticipantSection = false,
}) {
  const currentMenu = menuItems.find((item) => item.label === selectedMainTab);
  const currentSubMenu = currentMenu?.subMenu || [];

  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [error, setError] = useState("");

  const documentType =
    documentScope === "sub" && selectedSubTab
      ? selectedSubTab
      : selectedMainTab;

  const {
    documents,
    sendings,
    isLoading,
    isError,
    addDocument,
    deleteDocument,
    updateDocument,
    deleteSending,
  } = useDocuments(selectedMainTab);

  const { participants } = useParticipants();
  const isSending = selectedMainTab === "Les envois";
  const isCEDIG = selectedMainTab === "CEDIG";

  const filteredDocuments = documents?.filter((doc) => {
    if (isCEDIG) {
      const allowedParticipants = participants
        ?.filter((p) => ["Client", "Fournisseur"].includes(p.type))
        .map((p) => p.id);
      if (!allowedParticipants.includes(doc.participantId)) return false;

      if (doc.projectId !== Number(projectId)) return false;
    } else {
      if (participantId && doc.participantId !== Number(participantId))
        return false;
      if (documentScope === "sub" && doc.type !== selectedSubTab) return false;
      if (documentScope === "main" && doc.type !== selectedMainTab)
        return false;
    }
    return true;
  });

  const handleSelectItem = (document) => {
    setIsDetailVisible(true);
    setIsAddingNew(false);
    setSelectedDocument(document);
  };

  const handleDocumentIdClick = (docId) => {
    const selectedDoc = documents.find((doc) => doc.id === docId);
    if (selectedDoc) handleSelectItem(selectedDoc);
  };

  return (
    <div className="mb-4">
      <Section title={title} />

      {ContactInfoComponent && (
        <div className="mb-6">
          <ContactInfoComponent />
        </div>
      )}

      {selectedMainTab?.length > 0 && (
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
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex space-x-2">
        <div className={isDetailVisible ? "w-2/3" : "w-full"}>
          {isLoading && <Loading />}
          {isError && <p>Erreur lors du chargement des documents.</p>}
          {!isLoading && !isError && (
            <ItemContainer
              items={isSending && sendings ? sendings : filteredDocuments}
              subMenuItems={currentSubMenu}
              selectedSubTab={selectedSubTab}
              setSelectedSubTab={setSelectedSubTab}
              onAdd={() => {
                setIsDetailVisible(true);
                setIsAddingNew(true);
                setSelectedDocument(null);
                setCheckboxVisible(true);
              }}
              onSelectItem={handleSelectItem}
              employeeId={employeeId}
              participantId={participantId}
              projectId={projectId}
              participants={participants}
              isCEDIG={isCEDIG}
              selectedDocuments={selectedDocuments}
              setSelectedDocuments={setSelectedDocuments}
              checkboxVisible={checkboxVisible}
              isSending={isSending}
              onDocumentIdClick={handleDocumentIdClick}
              onDelete={deleteSending.mutate}
              inParticipantSection={inParticipantSection}
            />
          )}
        </div>

        {isDetailVisible && (
          <div className="w-1/3">
            <DetailContainer
              onClose={() => {
                setIsDetailVisible(false);
                setSelectedDocument(null);
                setCheckboxVisible(false);
                setSelectedDocuments([]);
              }}
              isNew={isAddingNew}
              documentType={documentType}
              document={selectedDocument}
              addMutation={addDocument}
              deleteMutation={deleteDocument}
              updateMutation={updateDocument}
              employeeId={employeeId}
              participantId={participantId}
              projectId={projectId}
              isCEDIG={isCEDIG}
              selectedDocuments={selectedDocuments}
              isSending={isSending}
              inParticipantSection={inParticipantSection}
            />
          </div>
        )}
      </div>
    </div>
  );
}
