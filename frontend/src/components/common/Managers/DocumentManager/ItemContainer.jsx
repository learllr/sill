import { Plus, Send } from "lucide-react";
import { useState } from "react";
import { DocumentType } from "../../../../../../shared/constants/types.js";
import { formatDate } from "../../../../../../shared/utils/formatUtils.js";
import { useDocuments } from "../../../../hooks/useDocuments.jsx";
import ConfirmDialog from "../../../dialogs/ConfirmDialog.jsx";
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
  inParticipantSection,
  onAddSending,
  isDOE,
  typeSpending,
  isTrash,
  showMessage,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { documents } = useDocuments();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  const handleToggleSelect = (documentId) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(documentId)
        ? prevSelected.filter((id) => id !== documentId)
        : [...prevSelected, documentId]
    );
  };

  const handleDelete = (document) => {
    setDocumentToDelete(document);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      onDelete(documentToDelete.id, {
        onSuccess: () => {
          showMessage("success", "L'envoi a été supprimé avec succès.");
        },
        onError: () => {
          showMessage("error", "Erreur lors de la suppression de l'envoi.");
        },
      });
      setIsConfirmOpen(false);
      setDocumentToDelete(null);
    }
  };

  const filteredItems = isDOE
    ? items
    : isSending
    ? typeSpending === "DOE"
      ? items.filter(
          (item) =>
            item.type === typeSpending && item.projectId === Number(projectId)
        )
      : typeSpending === "CEDIG"
      ? items.filter((item) => item.type === typeSpending)
      : items
    : items
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
            if (employeeId) return true;
            if (item.type === DocumentType.DEVIS) {
              const status = item.quoteInfos?.status;
              if (selectedSubTab === "En attente")
                return status === "En attente";
              if (selectedSubTab === "Acceptés") return status === "Accepté";
              if (selectedSubTab === "Rejetés") return status === "Rejeté";
            } else if (item.type === DocumentType.FACTURES) {
              const paidOn = item.invoiceInfos?.paidOn;
              if (selectedSubTab === "Payés") return !!paidOn;
              if (selectedSubTab === "Non payés") return !paidOn;
            } else if (item.type === DocumentType.PV) {
              if (selectedSubTab === "Avec réserves")
                return item.pvType === "Avec réserves";
              if (selectedSubTab === "Sans réserves")
                return item.pvType === "Sans réserves";
            }
          }
          if (!isTrash) {
            if (participantId && item.participantId !== Number(participantId))
              return false;
            if (projectId && item.projectId !== Number(projectId)) return false;
          }

          return selectedSubTab === "Tous" || !selectedSubTab;
        })
        .filter((item) => {
          if (!searchTerm) return true;

          const searchTerms = searchTerm.toLowerCase().split(" ");

          const formattedDate = formatDate(
            employeeId ? item.createdAt : item.date
          );
          const quoteNumber = item.quoteInfos?.quoteNumber?.toLowerCase() || "";
          const invoiceNumber =
            item.invoiceInfos?.invoiceNumber?.toLowerCase() || "";
          const name = item.name?.toLowerCase() || "";

          return searchTerms.every(
            (term) =>
              name.includes(term) ||
              formattedDate.includes(term) ||
              quoteNumber.includes(term) ||
              invoiceNumber.includes(term)
          );
        });

  const groupedByYear = filteredItems.reduce((acc, item) => {
    const documentDate = item.date ? new Date(item.date) : null;
    if (documentDate) {
      const year = documentDate.getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
    }
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div
      className={`p-4 flex flex-col space-y-3 h-[80vh] ${
        isTrash ? "border border-rose-300" : "border"
      }`}
    >
      <div className="flex justify-between items-center space-x-2">
        <ScrollBarSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {!isSending && !inParticipantSection && !isDOE && !isTrash && (
          <IconButton onClick={onAdd} variant="green">
            <Plus />
          </IconButton>
        )}
        {(isCEDIG || isDOE) && (
          <IconButton onClick={onAddSending} variant="blue">
            <Send />
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
        {sortedYears.map((year) => (
          <div key={year}>
            {!employeeId && (
              <h3 className="text-base font-bold text-gray-700 mb-1">{year}</h3>
            )}
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${
                  isSending ? "230px" : "180px"
                }, min-content))`,
              }}
            >
              {groupedByYear[year].map((item) => (
                <div key={item.id}>
                  {isSending ? (
                    <SendingCard
                      document={item}
                      onDocumentIdClick={onDocumentIdClick}
                      onDelete={() => handleDelete(item)}
                      participants={participants}
                      documents={documents}
                    />
                  ) : (
                    <DocumentCard
                      document={item}
                      onSelectItem={onSelectItem}
                      employeeId={employeeId}
                      onToggleSelect={handleToggleSelect}
                      selectedDocuments={selectedDocuments}
                      checkboxVisible={checkboxVisible}
                      isCEDIG={isCEDIG}
                      participants={participants}
                      isDOE={isDOE}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message="Voulez-vous vraiment supprimer cet envoi ?"
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
