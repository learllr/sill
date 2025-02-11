import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import NavigationTabs from "../../Design/Buttons/NavigationTabs.jsx";
import Loading from "../../Design/Loading.jsx";
import Section from "../Section.jsx";
import DetailContainer from "./DetailContainer.jsx";
import ItemContainer from "./ItemContainer.jsx";

export default function ProjectManager({
  title,
  selectedMainTab,
  setSelectedMainTab,
  selectedSubTab = null,
  setSelectedSubTab = null,
  menuItems,
  projectId,
  MarketInfoComponent = null,
  ProjectInfoComponent = null,
}) {
  const navigate = useNavigate();
  const currentMenu = menuItems.find((item) => item.label === selectedMainTab);
  const currentSubMenu = currentMenu?.subMenu || [];

  const {
    projects,
    addProject,
    isLoadingProjects: isLoading,
    isError,
  } = useProjects(selectedMainTab, projectId);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="mb-4">
      <Section title={title} />

      {projectId && (
        <div className="mb-6 space-y-4">
          {ProjectInfoComponent && (
            <ProjectInfoComponent projectId={projectId} />
          )}
          {MarketInfoComponent && <MarketInfoComponent projectId={projectId} />}
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

      {isError && (
        <p className="text-red-500 text-center">
          Erreur lors du chargement des projets.
        </p>
      )}

      <div className="flex space-x-2">
        <div className={isDetailVisible ? "w-2/3" : "w-full"}>
          {isLoading && <Loading />}
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
                navigate(`/chantiers/${project.id}`);
              }}
              projectId={projectId}
              mainTab={selectedMainTab}
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
              projectId={projectId}
              selectedMainTab={selectedMainTab}
              projects={projects}
            />
          </div>
        )}
      </div>
    </div>
  );
}
