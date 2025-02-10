import { User, FileText, Trash2 } from "lucide-react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import { ParticipantType } from "../../../../../../shared/constants/types.js";

export default function ParticipantProjectCard({
  project,
  onSelectItem,
  onDelete,
  mainTab,
}) {
  const participantKey = {
    [ParticipantType.CLIENT]: "clients",
    [ParticipantType.FOURNISSEUR]: "suppliers",
    [ParticipantType.SOUS_TRAITANT]: "subcontractors",
    [ParticipantType.ARCHITECTE]: "architects",
  }[mainTab];

  const participants = project[participantKey] || [];

  return (
    <>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center w-full max-w-[400px] min-w-[250px] justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
        >
          <div className="flex items-center space-x-3">
            <User className="text-gray-500" />
            <p className="text-md text-gray-800">{participant.name}</p>
          </div>

          <div className="flex space-x-2">
            <IconButton
              onClick={() => onSelectItem(participant)}
              variant="blue"
            >
              <FileText size={16} />
            </IconButton>

            <IconButton onClick={() => onDelete(participant.id)} variant="red">
              <Trash2 size={16} />
            </IconButton>
          </div>
        </div>
      ))}
    </>
  );
}
