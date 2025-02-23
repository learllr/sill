import React, { useState } from "react";
import { useDocuments } from "../../../../hooks/useDocuments.jsx";
import { useParticipants } from "../../../../hooks/useParticipants.jsx";
import { useMessageDialog } from "../../../contexts/MessageDialogContext.jsx";
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
  typeSpending,
  isTrash = false,
}) {
  const currentMenu = menuItems?.find((item) => item.label === selectedMainTab);
  const currentSubMenu = currentMenu?.subMenu || [];
  const { showMessage } = useMessageDialog();

  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAddingSending, setIsAddingSending] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const isDOE = selectedMainTab === "DOE";
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
    addSending,
    updateDocument,
    deleteSending,
  } = useDocuments(selectedMainTab);

  const allDocuments =
    documents?.filter((doc) => doc.deleted === isTrash) || [];

  const { participants } = useParticipants();
  const isSending = selectedMainTab === "Les envois";
  const isCEDIG = selectedMainTab === "CEDIG";

  const filteredDocuments = isTrash
    ? allDocuments
    : isDOE
    ? allDocuments?.filter((doc) =>
        projectId
          ? doc.type === "Fiches techniques" &&
            doc.projectId === Number(projectId)
          : doc.type === "Fiches techniques"
      )
    : allDocuments?.filter((doc) => {
        if (isCEDIG) {
          if (doc.type !== "Factures") return false;
        } else {
          if (participantId && doc.participantId !== Number(participantId))
            return false;
          if (documentScope === "sub" && doc.type !== selectedSubTab)
            return false;
          if (documentScope === "main" && doc.type !== selectedMainTab)
            return false;
        }
        return true;
      });

  const handleSelectItem = (document) => {
    if (!checkboxVisible) {
      setIsDetailVisible(true);
      setIsAddingNew(false);
      setSelectedDocument(document);
    }
  };

  const handleDocumentIdClick = (docId) => {
    const selectedDoc = allDocuments.find((doc) => doc.id === docId);
    if (selectedDoc) handleSelectItem(selectedDoc);
  };

  return (
    <div className="mb-4">
      {title && <Section title={title} />}

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

      <div className="flex space-x-2">
        <div className={isDetailVisible ? "w-2/3" : "w-full"}>
          {isLoading && <Loading />}
          {isError &&
            showMessage("error", "Erreur lors du chargement des documents.")}

          {!isLoading && !isError && (
            <ItemContainer
              items={isSending && sendings ? sendings : filteredDocuments}
              subMenuItems={currentSubMenu}
              selectedSubTab={selectedSubTab}
              setSelectedSubTab={setSelectedSubTab}
              onAdd={() => {
                setIsDetailVisible(true);
                setIsAddingNew(true);
                setIsAddingSending(false);
                setSelectedDocument(null);
              }}
              onAddSending={() => {
                setIsDetailVisible(true);
                setIsAddingNew(true);
                setIsAddingSending(true);
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
              isDOE={isDOE}
              typeSpending={typeSpending}
              isTrash={isTrash}
              showMessage={showMessage}
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
              addSending={addSending}
              employeeId={employeeId}
              participantId={participantId}
              projectId={projectId}
              isCEDIG={isCEDIG}
              selectedDocuments={selectedDocuments}
              isSending={isSending}
              inParticipantSection={inParticipantSection}
              isAddingSending={isAddingSending}
              isDOE={isDOE}
              isTrash={isTrash}
              showMessage={showMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
