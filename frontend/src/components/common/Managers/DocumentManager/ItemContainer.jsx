import { Plus } from "lucide-react";
import { useState } from "react";
import { DocumentType } from "../../../../../../shared/constants/types.js";
import { sortAndGroupDocuments } from "../../../../../../shared/utils/organizeDocuments.js";
import { useDocuments } from "../../../../hooks/useDocuments.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import NavigationSubTabs from "../../Design/Buttons/NavigationSubTabs.jsx";
import ScrollBarSearch from "../ScrollBarSearch.jsx";
import DocumentCard from "./DocumentCard.jsx";
import SendingCard from "./SendingCard.jsx";

export default function ItemContainer({
  items,
  subMenuItems,
  selectedSubTab,
  setSelectedSubTab,
  onAdd,
  onSelectItem,
  employeeId,
  participantId,
  projectId,
  participants,
  isCEDIG,
  selectedDocuments,
  setSelectedDocuments,
  checkboxVisible,
  isSending,
  onDocumentIdClick,
  onDelete,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { documents } = useDocuments();

  const handleToggleSelect = (documentId) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(documentId)
        ? prevSelected.filter((id) => id !== documentId)
        : [...prevSelected, documentId]
    );
  };

  const filteredItems = items
    .filter((item) => {
      if (isCEDIG) {
        if (selectedSubTab === "Fournisseurs") {
          return participants?.some(
            (p) => p.id === item.participantId && p.type === "Fournisseur"
          );
        }
        if (selectedSubTab === "Clients") {
          return participants?.some(
            (p) => p.id === item.participantId && p.type === "Client"
          );
        }
      } else {
        if (participantId && item.participantId !== Number(participantId))
          return false;
        if (projectId && item.projectId !== Number(projectId)) return false;
        if (employeeId) return true;
        if (item.type === DocumentType.DEVIS) {
          const status = item.quoteInfos[0]?.status;
          if (selectedSubTab === "En attente") return status === "En attente";
          if (selectedSubTab === "Acceptés") return status === "Accepté";
          if (selectedSubTab === "Rejetés") return status === "Rejeté";
        } else if (item.type === DocumentType.FACTURES) {
          const paidOn = item.invoiceInfos[0]?.paidOn;
          if (selectedSubTab === "Payés") return !!paidOn;
          if (selectedSubTab === "Non payés") return !paidOn;
        } else if (item.type === DocumentType.PV) {
          if (selectedSubTab === "Avec réserves")
            return item.pvType === "Avec réserves";
          if (selectedSubTab === "Sans réserves")
            return item.pvType === "Sans réserves";
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
        {!isSending && (
          <IconButton onClick={onAdd} variant="green">
            <Plus />
          </IconButton>
        )}
      </div>

      {setSelectedSubTab && subMenuItems.length > 0 && (
        <NavigationSubTabs
          subMenuItems={
            items.some((item) => item.type === DocumentType.PV)
              ? ["Tous", "Avec réserves", "Sans réserves"]
              : subMenuItems
          }
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
                  gridTemplateColumns: `repeat(auto-fit, minmax(${
                    isSending ? "230px" : "180px"
                  }, max-content))`,
                }}
              >
                {docs.map((item) => (
                  <>
                    {isSending ? (
                      <SendingCard
                        key={item.id}
                        document={item}
                        onDocumentIdClick={onDocumentIdClick}
                        onDelete={onDelete}
                        participants={participants}
                        documents={documents}
                      />
                    ) : (
                      <DocumentCard
                        key={item.id}
                        document={item}
                        onSelectItem={onSelectItem}
                        employeeId={employeeId}
                        onToggleSelect={handleToggleSelect}
                        selectedDocuments={selectedDocuments}
                        checkboxVisible={checkboxVisible}
                      />
                    )}
                  </>
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
