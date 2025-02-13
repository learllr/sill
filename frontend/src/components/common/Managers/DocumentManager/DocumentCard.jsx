import { DocumentType } from "../../../../../../shared/constants/types.js";
import { formatDate } from "../../../../../../shared/utils/dateUtils.js";
import getFileIcon from "../../../../../../shared/utils/getFileIcon.jsx";

export default function DocumentCard({
  document,
  onSelectItem,
  employeeId,
  onToggleSelect,
  selectedDocuments,
  checkboxVisible,
  isSending,
}) {
  const isChecked = selectedDocuments.includes(document.id);

  const getBorderColor = () => {
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
      {checkboxVisible && isSending && (
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
