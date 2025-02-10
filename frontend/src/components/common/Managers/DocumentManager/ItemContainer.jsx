import { Plus } from "lucide-react";
import { useState } from "react";
import { DocumentType } from "../../../../../../shared/constants/types.js";
import { sortAndGroupDocuments } from "../../../../../../shared/utils/organizeDocuments.js";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import NavigationSubTabs from "../../Design/Buttons/NavigationSubTabs.jsx";
import ScrollBarSearch from "../ScrollBarSearch.jsx";
import DocumentCard from "./DocumentCard.jsx";

export default function ItemContainer({
  items,
  subMenuItems,
  selectedSubTab,
  setSelectedSubTab,
  onAdd,
  onSelectItem,
  employeeId,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items
    .filter((item) => {
      if (employeeId) return true; // Si employeeId est présent, ne pas filtrer par statut

      if (
        item.type === DocumentType.DEVIS ||
        item.type === DocumentType.DEVIS_VALIDES
      ) {
        const status = item.quoteInfos[0]?.status;
        if (selectedSubTab === "En attente") return status === "En attente";
        if (selectedSubTab === "Acceptés") return status === "Accepté";
        if (selectedSubTab === "Rejetés") return status === "Rejeté";
      } else if (item.type === DocumentType.FACTURES) {
        const paidOn = item.invoiceInfos[0]?.paidOn;

        if (selectedSubTab === "Payés") {
          return !!paidOn;
        }

        if (selectedSubTab === "Non payés") {
          return !paidOn;
        }
      }

      return selectedSubTab === "Tous" || !selectedSubTab;
    })
    .filter((item) => {
      if (!searchTerm) return true;

      const searchTerms = searchTerm.toLowerCase().split(" ");

      if (employeeId) {
        const createdAt = item.createdAt ? new Date(item.createdAt) : null;

        if (!createdAt) return false;

        const formattedDate = `${createdAt
          .getDate()
          .toString()
          .padStart(2, "0")}/${(createdAt.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${createdAt.getFullYear()}`;

        return searchTerms.every((term) => formattedDate.includes(term));
      } else {
        const year = item.year ? item.year.toString() : "";
        const month = item.month ? item.month.toLowerCase() : "";
        return searchTerms.every(
          (term) => year.includes(term) || month.includes(term)
        );
      }
    });

  const groupedByYear = sortAndGroupDocuments(filteredItems);

  return (
    <div className="border p-4 flex flex-col space-y-3 h-[80vh]">
      <div className="flex justify-between items-center space-x-2">
        <ScrollBarSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <IconButton onClick={onAdd} variant="green">
          <Plus />
        </IconButton>
      </div>

      {setSelectedSubTab && subMenuItems.length > 0 && (
        <NavigationSubTabs
          subMenuItems={subMenuItems}
          selectedSubTab={selectedSubTab}
          setSelectedSubTab={setSelectedSubTab}
        />
      )}

      <div className="space-y-4 p-2 overflow-auto">
        {Object.keys(groupedByYear).length > 0 ? (
          Object.entries(groupedByYear).map(([year, docs]) => (
            <div key={year}>
              {!employeeId && (
                <h3 className="text-base font-bold text-gray-700 mb-1">
                  {year}
                </h3>
              )}
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, max-content))",
                }}
              >
                {docs.map((item) => (
                  <DocumentCard
                    key={item.id}
                    document={item}
                    onSelectItem={onSelectItem}
                    employeeId={employeeId}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun document trouvé</p>
        )}
      </div>
    </div>
  );
}
