import { formatDate } from "../../../../../../shared/utils/formatUtils.js";

export default function ProjectCard({ project, onSelectItem }) {
  const getStatusColor = () => {
    switch (project.status) {
      case "Non commencé":
        return "border-gray-300";
      case "En cours":
        return "border-yellow-500";
      case "Terminé":
        return "border-green-500";
      case "Annulé":
        return "border-red-500";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div
      className={`border ${getStatusColor()} p-3 rounded-lg text-center w-[220px] flex-shrink-0 hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer`}
      onClick={() => onSelectItem(project)}
    >
      <h3 className="font-semibold text-lg">{project.name}</h3>
      <p className="text-gray-600">{project.client}</p>
      <p className="mt-2 text-gray-800">
        {project.updatedAt
          ? `Mis à jour : ${formatDate(project.updatedAt)}`
          : "Date inconnue"}
      </p>
    </div>
  );
}
