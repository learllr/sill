import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import Loading from "../../Design/Loading.jsx";
import Combobox from "../../Design/Buttons/Combobox.jsx";

export default function MarketInfo({ projectId }) {
  const {
    projects,
    updateProject,
    isLoadingProjects: isLoading,
  } = useProjects();
  const project = projects?.find((p) => p.id === parseInt(projectId, 10));

  const [isEditing, setIsEditing] = useState(false);
  const [selectedClients, setSelectedClients] = useState(
    project?.clients || []
  );
  const [selectedArchitects, setSelectedArchitects] = useState(
    project?.architects || []
  );
  const [RG, setRG] = useState(project?.RG || false);
  const [prorata, setProrata] = useState(project?.prorata || false);

  if (isLoading) return <Loading />;
  if (!project)
    return <p className="text-red-500 text-center">Marché introuvable.</p>;

  const handleSave = () => {
    updateProject.mutate({
      projectId: project.id,
      updatedData: {
        clients: selectedClients,
        architects: selectedArchitects,
        RG,
        prorata,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="border p-4 rounded-lg bg-gray-100">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Marché</h3>
        {isEditing ? (
          <IconButton onClick={() => setIsEditing(false)} variant="gray">
            <X />
          </IconButton>
        ) : (
          <IconButton onClick={() => setIsEditing(true)} variant="blue">
            <Pencil />
          </IconButton>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <label className="block">
            <span className="text-gray-700">Client</span>
            <Combobox
              subjects={projects?.clients || []}
              onSelect={setSelectedClients}
              placeholder="Sélectionnez un ou plusieurs clients..."
              defaultValue={selectedClients}
              multiple
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Architecte</span>
            <Combobox
              subjects={projects?.architects || []}
              onSelect={setSelectedArchitects}
              placeholder="Sélectionnez un ou plusieurs architectes..."
              defaultValue={selectedArchitects}
              multiple
            />
          </label>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={RG}
              onChange={(e) => setRG(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-gray-700">RG (5%)</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={prorata}
              onChange={(e) => setProrata(e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-gray-700">Prorata (2%)</label>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Sauvegarder
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            <strong>Client :</strong>{" "}
            {selectedClients.length > 0 ? selectedClients.join(", ") : "Aucun"}
          </p>
          <p>
            <strong>Architecte :</strong>{" "}
            {selectedArchitects.length > 0
              ? selectedArchitects.join(", ")
              : "Aucun"}
          </p>
          <p>
            <strong>RG (5%) :</strong> {RG ? "Oui" : "Non"}
          </p>
          <p>
            <strong>Prorata (2%) :</strong> {prorata ? "Oui" : "Non"}
          </p>
        </div>
      )}
    </div>
  );
}
