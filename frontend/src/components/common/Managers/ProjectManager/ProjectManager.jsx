import React, { useState } from "react";
import NavigationTabs from "../../Design/Buttons/NavigationTabs.jsx";
import Loading from "../../Design/Loading.jsx";
import Section from "../Section.jsx";
import DetailContainer from "./DetailContainer.jsx";
import ItemContainer from "./ItemContainer.jsx";
import { useProjects } from "../../../../hooks/useProjects.jsx";

export default function ProjectManager({
  title,
  selectedMainTab,
  setSelectedMainTab,
  selectedSubTab = null,
  setSelectedSubTab = null,
  menuItems,
  projectId = null,
  MarketInfoComponent = null,
}) {
  const currentMenu = menuItems.find((item) => item.label === selectedMainTab);
  const currentSubMenu = currentMenu?.subMenu || [];

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState("");

  const {
    projects,
    isLoadingProjects: isLoading,
    isError,
    addProject,
    deleteProject,
    updateProject,
  } = useProjects(selectedSubTab);

  return (
    <div className="mb-4">
      <Section title={title} />

      {MarketInfoComponent && (
        <div className="mb-6">
          <MarketInfoComponent />
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
          {isError && (
            <p className="text-red-500 text-center">
              Erreur lors du chargement des projets.
            </p>
          )}
          {!isLoading && !isError && (
            <ItemContainer
              items={projects || []}
              subMenuItems={currentSubMenu}
              selectedSubTab={selectedSubTab}
              setSelectedSubTab={setSelectedSubTab}
              onAdd={() => {
                setIsDetailVisible(true);
                setIsAddingNew(true);
                setSelectedProject(null);
              }}
              onSelectItem={(project) => {
                setIsDetailVisible(true);
                setIsAddingNew(false);
                setSelectedProject(project);
              }}
              projectId={projectId}
            />
          )}
        </div>

        {isDetailVisible && (
          <div className="w-1/3">
            <DetailContainer
              onClose={() => {
                setIsDetailVisible(false);
                setSelectedProject(null);
              }}
              isNew={isAddingNew}
              project={selectedProject}
              addMutation={addProject}
              deleteMutation={deleteProject}
              updateMutation={updateProject}
              projectId={projectId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
