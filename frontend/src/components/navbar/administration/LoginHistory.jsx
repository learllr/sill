import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHistory } from "@/hooks/useHistory";
import { useState } from "react";
import { useMessageDialog } from "../../contexts/MessageDialogContext";
import ConfirmDialog from "../../dialogs/ConfirmDialog";

export default function LoginHistory() {
  const { history, isLoading, isError, deleteMutation } = useHistory();
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { showMessage } = useMessageDialog();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    onConfirm: () => {},
  });

  const rowsPerPage = 10;
  const totalPages =
    history?.length > 0 ? Math.ceil(history.length / rowsPerPage) : 0;
  const paginatedHistory = history?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (isLoading) return <p>Chargement...</p>;
  if (isError)
    return showMessage(
      "error",
      "Erreur lors du chargement de l'historique des connexions."
    );

  const toggleSelectAll = () => {
    const pageIds = paginatedHistory.map((h) => h.id);
    setSelectedRows((prev) => (prev.length === pageIds.length ? [] : pageIds));
  };

  const toggleSelection = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const confirmDeleteSelected = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Confirmer la suppression",
      message: `Êtes-vous sûr de vouloir supprimer ${selectedRows.length} ${
        selectedRows.length > 1 ? "lignes" : "ligne"
      } ? Cette action est irréversible.`,
      confirmText: "Supprimer",
      cancelText: "Annuler",
      onConfirm: handleDeleteSelected,
    });
  };

  const handleDeleteSelected = () => {
    deleteMutation.mutate(selectedRows, {
      onSuccess: () => {
        showMessage(
          "success",
          `${
            selectedRows.length > 1
              ? `${selectedRows.length} lignes supprimées`
              : `${selectedRows.length} ligne supprimée`
          } avec succès.`
        );
        setSelectedRows([]);
        setConfirmDialog({ isOpen: false });
      },
      onError: () => {
        showMessage("error", "Erreur lors de la suppression des lignes.");
        setConfirmDialog({ isOpen: false });
      },
    });
  };

  return (
    <div className="px-4 mb-10">
      <h1 className="text-lg font-semibold mb-4 ">Historique de connexions</h1>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">
          {selectedRows.length}{" "}
          {selectedRows.length > 1
            ? "lignes sélectionnées"
            : "ligne sélectionnée"}
        </span>

        <Button
          variant="destructive"
          onClick={confirmDeleteSelected}
          disabled={selectedRows.length <= 0}
        >
          Supprimer
        </Button>
      </div>

      {history?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="min-w-full text-center">
            <TableHeader>
              <TableRow className="h-8">
                <TableHead className="w-1/12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.length === paginatedHistory.length &&
                      paginatedHistory.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </TableHead>
                <TableHead className="w-1/3 text-center">Utilisateur</TableHead>
                <TableHead className="w-1/3 text-center">
                  Date de connexion
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHistory?.map((log) => (
                <TableRow
                  key={log.id}
                  className={`h-8 transition-colors ${
                    selectedRows.includes(log.id) ? " bg-gray-100" : ""
                  }`}
                >
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(log.id)}
                      onChange={() => toggleSelection(log.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {log.user
                      ? `${log.user.firstName} ${log.user.lastName}`
                      : "Utilisateur inconnu"}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(log.loginAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>Aucun historique de connexion.</p>
      )}

      <div className="mt-4 flex justify-center space-x-2">
        <Button
          variant="secondary"
          disabled={currentPage === 1 || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Précédent
        </Button>
        <span className="flex items-center">
          {history?.length > 0 ? `${currentPage} / ${totalPages}` : "0 / 0"}
        </span>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Suivant
        </Button>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
      />
    </div>
  );
}
