import { useEffect, useState } from "react";
import { useParticipants } from "../../../../hooks/useParticipants.jsx";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";

export default function ParticipantSelector({
  participantType,
  onClose,
  project,
}) {
  const { participants, isLoading, isError } = useParticipants();
  const { deleteParticipantProject, addParticipantProject } = useProjects();
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.type === participantType && participant.deleted === false
  );

  useEffect(() => {
    if (project) {
      const typeMapping = {
        Client: "clients",
        Fournisseur: "suppliers",
        "Sous-traitant": "subcontractors",
        Architecte: "architects",
      };

      const projectKey = typeMapping[participantType];

      if (projectKey) {
        const existingParticipants = project[projectKey] || [];
        const existingIds = existingParticipants.map((p) => p.id);
        setSelectedParticipants(existingIds);
      }
    }
  }, [project, participantType]);

  const handleSelect = (participantId) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleAssign = () => {
    if (!project) return;

    const typeMapping = {
      Client: "clients",
      Fournisseur: "suppliers",
      "Sous-traitant": "subcontractors",
      Architecte: "architects",
    };

    const projectKey = typeMapping[participantType];
    const existingParticipants = project[projectKey] || [];
    const existingIds = existingParticipants.map((p) => p.id);

    const participantsToAdd = selectedParticipants.filter(
      (id) => !existingIds.includes(id)
    );
    const participantsToRemove = existingIds.filter(
      (id) => !selectedParticipants.includes(id)
    );

    participantsToAdd.forEach((participantId) => {
      addParticipantProject.mutate({
        projectId: project.id,
        participantId,
        type: participantType,
      });
    });

    participantsToRemove.forEach((participantId) => {
      deleteParticipantProject.mutate({ projectId: project.id, participantId });
    });

    onClose();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-center mb-4">
        {`Modifier les ${participantType.toLowerCase()}s du chantier`}
      </h2>

      {isLoading && <p>Chargement...</p>}
      {isError && <p className="text-red-500">Erreur lors du chargement</p>}

      {!isLoading && !isError && (
        <div className="space-y-2 max-h-60 overflow-auto">
          {filteredParticipants.map((participant) => (
            <label
              key={participant.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedParticipants.includes(participant.id)}
                onChange={() => handleSelect(participant.id)}
                className="w-4 h-4"
              />
              <span className="text-gray-800">{participant.name}</span>
            </label>
          ))}
        </div>
      )}

      <div className="flex justify-center w-full space-x-2 mt-4">
        <IconButton onClick={onClose} variant="gray" className="w-full">
          Annuler
        </IconButton>
        <IconButton onClick={handleAssign} variant="blue" className="w-full">
          Modifier
        </IconButton>
      </div>
    </div>
  );
}
