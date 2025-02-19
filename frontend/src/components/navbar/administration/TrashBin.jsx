import { useState } from "react";
import {
  employeeMenuItems,
  projectMenuItems,
} from "../../../../../shared/constants/menuItems.js";
import NavigationTabs from "../../common/Design/Buttons/NavigationTabs";
import ContactManager from "../../common/Managers/ContactManager/ContactManager.jsx";
import DocumentManager from "../../common/Managers/DocumentManager/DocumentManager.jsx";
import ProjectManager from "../../common/Managers/ProjectManager/ProjectManager.jsx";

export default function TrashBin() {
  const categories = [
    "Projets",
    "Clients",
    "Fournisseurs",
    "Sous-traitants",
    "Architectes",
    "Salariés",
    "Documents",
  ];
  const contactTypes = [
    "Clients",
    "Fournisseurs",
    "Sous-traitants",
    "Architectes",
    "Salariés",
  ];

  const [selectedSubTab, setSelectedSubTab] = useState("Projets");
  const [selectedSubProjects, setSelectedSubProjects] = useState("En cours");
  const [selectedSubEmployees, setSelectedSubEmployees] = useState("Tous");

  const getSingular = (type) => (type.endsWith("s") ? type.slice(0, -1) : type);

  return (
    <div className="space-y-6 px-4 mb-8">
      <h1 className="text-lg font-semibold">Corbeille</h1>

      <NavigationTabs
        menuItems={categories}
        selectedTab={selectedSubTab}
        onTabChange={setSelectedSubTab}
      />

      {selectedSubTab === "Projets" && (
        <ProjectManager
          menuItems={projectMenuItems}
          selectedSubTab={selectedSubProjects}
          setSelectedSubTab={setSelectedSubProjects}
          isTrash={true}
        />
      )}

      {selectedSubTab === "Documents" && <DocumentManager isTrash={true} />}

      {contactTypes.includes(selectedSubTab) && (
        <ContactManager
          contactType={
            selectedSubTab === "Salariés"
              ? "employee"
              : getSingular(selectedSubTab)
          }
          menuItems={employeeMenuItems}
          selectedSubTab={selectedSubEmployees}
          setSelectedSubTab={setSelectedSubEmployees}
          isTrash={true}
        />
      )}

      {selectedSubTab === "Tous" && (
        <div className="px-4 text-gray-600">
          Sélectionnez une catégorie pour afficher son contenu supprimé.
        </div>
      )}
    </div>
  );
}
