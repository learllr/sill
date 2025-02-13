import { DocumentType } from "../../../../../../shared/constants/types.js";
import { formatDate } from "../../../../../../shared/utils/formatUtils.js";
import getFileIcon from "../../../../../../shared/utils/getFileIcon.jsx";

export default function DocumentCard({
  document,
  onSelectItem,
  employeeId,
  onToggleSelect,
  selectedDocuments,
  checkboxVisible,
  isCEDIG,
  participants,
}) {
  const isChecked = selectedDocuments.includes(document.id);

  const getBorderColor = () => {
    if (isCEDIG) {
      const participant = participants?.find(
        (p) => p.id === document.participantId
      );
      if (participant?.type === "Fournisseur") {
        return "border-yellow-700";
      }
      if (participant?.type === "Client") {
        return "border-blue-500";
      }
    }

    if (document.type === DocumentType.DEVIS) {
      switch (document.quoteInfos[0]?.status) {
        case "En attente":
          return "border-yellow-500";
        case "Accepté":
          return "border-green-500";
        case "Rejeté":
          return "border-red-500";
        default:
          return "border-gray-300";
      }
    }

    if (document.type === DocumentType.FACTURES) {
      const paidOn = document.invoiceInfos[0]?.paidOn;
      return !paidOn ? "border-red-500" : "border-green-500";
    }

    return "border-gray-300";
  };

  return (
    <div
      className={`relative border ${getBorderColor()} p-3 rounded-lg text-center w-[180px] flex-shrink-0 hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer`}
      onClick={() => onSelectItem(document)}
    >
      {checkboxVisible && isCEDIG && (
        <input
          type="checkbox"
          className="absolute top-2 right-2 w-5 h-5 cursor-pointer"
          checked={isChecked}
          onChange={() => onToggleSelect(document.id)}
          onClick={(e) => e.stopPropagation()}
        />
      )}

      {getFileIcon(document.path)}
      <p className="mt-2 text-gray-800">
        {employeeId
          ? formatDate(document.updatedAt)
          : `${document.year} - ${document.month}`}
      </p>
    </div>
  );
}
