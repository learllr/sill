import { DocumentType } from "../../../../../../shared/constants/types.js";
import { formatDate } from "../../../../../../shared/utils/dateUtils.js";
import getFileIcon from "../../../../../../shared/utils/getFileIcon";

export default function DocumentCard({ document, onSelectItem, employeeId }) {
  const getBorderColor = () => {
    if (document.type === DocumentType.DEVIS) {
      switch (document.quoteInfos[0].status) {
        case "En attente":
          return "border-orange-500";
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

      if (!paidOn || paidOn === "") {
        return "border-red-500";
      }

      return "border-green-500";
    }

    return "border-gray-300";
  };

  return (
    <div
      className={`border ${getBorderColor()} p-3 rounded-lg text-center w-[180px] flex-shrink-0 hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer`}
      onClick={() => onSelectItem(document)}
    >
      {getFileIcon(document.path)}
      <p className="mt-2">
        {employeeId
          ? formatDate(document.updatedAt)
          : `${document.year} - ${document.month}`}
      </p>
    </div>
  );
}
