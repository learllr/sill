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

  const isInvoice = document.type === DocumentType.FACTURES;
  const isQuote = document.type === DocumentType.DEVIS;
  const isPV = document.type === DocumentType.PV;

  const getBorderColor = () => {
    if (isCEDIG) {
      const participant = participants?.find(
        (p) => p.id === document.participantId
      );
      if (participant?.type === "Fournisseur") {
        return "border-yellow-700";
      } else if (participant?.type === "Client") {
        return "border-blue-500";
      } else {
        return "border-gray-300";
      }
    }

    if (isQuote) {
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

    if (isInvoice) {
      return !document.invoiceInfos[0]?.paidOn
        ? "border-red-500"
        : "border-green-500";
    }

    if (isPV) {
      if (document.pvType === "Sans réserves") return "border-red-500";
      if (document.pvType === "Avec réserves") return "border-green-500";
    }

    return "border-gray-300";
  };

  return (
    <div
      className={`relative border ${getBorderColor()} p-4 rounded-lg text-center w-[200px] flex-shrink-0 bg-white transition-transform duration-200 ease-in-out cursor-pointer`}
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

      {document.name && (
        <div className="text-zinc-900 text-sm font-semibold px-3 rounded-md mb-2">
          {document.name}
        </div>
      )}

      {getFileIcon(document.path)}

      <p className="mt-2 text-gray-700 text-sm">
        {employeeId ? (
          formatDate(document.updatedAt)
        ) : isInvoice && document.invoiceInfos[0]?.invoiceNumber ? (
          <>
            {formatDate(document.date)}
            <br />
            <span className="text-gray-500 text-xs">
              {document.invoiceInfos[0]?.invoiceNumber}
            </span>
          </>
        ) : isQuote && document.quoteInfos[0]?.quoteNumber ? (
          <>
            {formatDate(document.date)}
            <br />
            <span className="text-gray-500 text-xs">
              {document.quoteInfos[0]?.quoteNumber}
            </span>
          </>
        ) : (
          formatDate(document.date)
        )}
      </p>
    </div>
  );
}
