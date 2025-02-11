import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import NavigationSubTabs from "../../Design/Buttons/NavigationSubTabs.jsx";
import ScrollBarSearch from "../ScrollBarSearch.jsx";
import ParticipantProjectCard from "./ParticipantProjectCard.jsx";
import ProjectCard from "./ProjectCard.jsx";

export default function ItemContainer({
  items,
  subMenuItems,
  selectedSubTab,
  setSelectedSubTab,
  onAdd,
  onSelectItem,
  projectId = null,
  mainTab,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBySubTab = items.filter((project) => {
    if (selectedSubTab === "Non commencés")
      return project.status === "Non commencé";
    if (selectedSubTab === "En cours") return project.status === "En cours";
    if (selectedSubTab === "Terminés") return project.status === "Terminé";
    if (selectedSubTab === "Annulés") return project.status === "Annulé";
    return true;
  });

  const filteredItems = projectId
    ? items.filter((project) => project.id === parseInt(projectId, 10))
    : filteredBySubTab.filter((project) => {
        if (!searchTerm) return true;

        const name = project.name?.toLowerCase() || "";
        return name.includes(searchTerm.toLowerCase());
      });

  return (
    <div className="border p-4 flex flex-col space-y-3 h-[80vh]">
      <div className="flex justify-between items-center space-x-2">
        <ScrollBarSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <IconButton onClick={onAdd} variant={projectId ? "blue" : "green"}>
          {projectId ? <Pencil /> : <Plus />}
        </IconButton>
      </div>

      {subMenuItems?.length > 0 && (
        <NavigationSubTabs
          subMenuItems={subMenuItems}
          selectedSubTab={selectedSubTab}
          setSelectedSubTab={setSelectedSubTab}
        />
      )}

      <div
        className="grid gap-3 p-2"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, max-content))",
        }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((project) =>
            projectId ? (
              <ParticipantProjectCard
                key={project.id}
                project={project}
                onSelectItem={onSelectItem}
                mainTab={mainTab}
              />
            ) : (
              <ProjectCard
                key={project.id}
                project={project}
                onSelectItem={onSelectItem}
              />
            )
          )
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            Aucun projet trouvé
          </p>
        )}
      </div>
    </div>
  );
}
