import React, { useState } from "react";
import { useDocuments } from "../../../hooks/useDocuments.jsx";
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
  isParticipant,
  isProject,
}) {
  const currentMenu = menuItems.find((item) => item.label === selectedMainTab);
  const currentSubMenu = currentMenu?.subMenu || [];

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [error, setError] = useState("");

  const {
    documents,
    isLoading,
    isError,
    addMutation,
    deleteMutation,
    updateMutation,
  } = useDocuments(selectedMainTab, selectedSubTab);

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
              }}
              isNew={isAddingNew}
              documentType={selectedMainTab}
              document={selectedDocument}
              addMutation={addMutation}
              deleteMutation={deleteMutation}
              updateMutation={updateMutation}
              isParticipant={isParticipant}
              isProject={isProject}
            />
          </div>
        )}
      </div>
    </div>
  );
}
