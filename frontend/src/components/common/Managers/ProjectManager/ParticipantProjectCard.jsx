import { FileText, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ParticipantType } from "../../../../../../shared/constants/types.js";
import { useProjects } from "../../../../hooks/useProjects.jsx";

export default function ParticipantProjectCard({ project, mainTab }) {
  const navigate = useNavigate();
  const { deleteParticipantProject } = useProjects();

  const participantKey = {
    [ParticipantType.CLIENT]: "clients",
    [ParticipantType.FOURNISSEUR]: "suppliers",
    [ParticipantType.SOUS_TRAITANT]: "subcontractors",
    [ParticipantType.ARCHITECTE]: "architects",
  }[mainTab];

  const participants = project[participantKey] || [];

  const participantPath =
    mainTab === ParticipantType.CLIENT
      ? "clients"
      : mainTab === ParticipantType.FOURNISSEUR
      ? "fournisseurs"
      : mainTab === ParticipantType.SOUS_TRAITANT
      ? "sous-traitants"
      : "architectes";

  return (
    <>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center w-full max-w-[400px] min-w-[250px] justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
          onClick={() =>
            navigate(
              `/chantiers/${project.id}/${participantPath}/${participant.id}`
            )
          }
        >
          <div className="flex items-center space-x-3">
            <User className="text-gray-500" />
            <p className="text-md text-gray-800">{participant.name}</p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/${participantPath}/${participant.id}`);
              }}
              className="bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-full p-2 transition"
            >
              <FileText size={16} />
            </button>

            <button
              onClick={(event) => {
                event.stopPropagation();
                deleteParticipantProject.mutate({
                  projectId: project.id,
                  participantId: participant.id,
                });
              }}
              className="bg-gray-100 hover:bg-red-100 text-red-600 rounded-full p-2 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
