import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useUsers } from "../../../hooks/useUsers";
import ActionButton from "../../common/Design/Buttons/ActionButton";
import { useMessageDialog } from "../../contexts/MessageDialogContext";
import ConfirmDialog from "../../dialogs/ConfirmDialog";
import UserTable from "./UserTable";

export default function UserPermissions() {
  const {
    users,
    roles,
    isLoading,
    isError,
    isLoadingRoles,
    isErrorRoles,
    addMutation,
    updateMutation,
    deleteMutation,
  } = useUsers();

  const defaultUser = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: roles?.length > 0 ? roles[0].id : 2,
  };

  const [newUser, setNewUser] = useState(defaultUser);
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    userId: null,
  });

  const { showMessage } = useMessageDialog();

  const handleAddUser = async () => {
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.password ||
      !newUser.roleId
    ) {
      showMessage("error", "Veuillez remplir tous les champs.");
      return;
    }

    addMutation.mutate(newUser, {
      onError: (error) => {
        showMessage(
          "error",
          error.response?.data?.error ||
            "Erreur lors de l'ajout de l'utilisateur."
        );
      },
      onSuccess: () => {
        showMessage("success", "Utilisateur ajouté avec succès !");
        setNewUser(defaultUser);
      },
    });
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleUpdateUser = async () => {
    if (
      !editedUser.firstName ||
      !editedUser.lastName ||
      !editedUser.email ||
      !editedUser.roleId
    ) {
      showMessage("error", "Veuillez remplir tous les champs.");
      return;
    }

    updateMutation.mutate(
      { id: editUserId, updatedData: editedUser },
      {
        onError: (error) => {
          showMessage(
            "error",
            error.response?.data?.error ||
              "Erreur lors de la mise à jour de l'utilisateur."
          );
        },
        onSuccess: () => {
          showMessage("success", "Utilisateur mis à jour avec succès !");
          setEditUserId(null);
        },
      }
    );
  };

  const handleDeleteUser = (userId) => {
    setConfirmDelete({ isOpen: true, userId });
  };

  const confirmDeleteUser = async () => {
    deleteMutation.mutate(confirmDelete.userId, {
      onError: (error) => {
        showMessage(
          "error",
          error.response?.data?.error ||
            "Erreur lors de la suppression de l'utilisateur."
        );
      },
      onSuccess: () => {
        showMessage(
          "success",
          "L'utilisateur a été supprimé définitivement avec succès !"
        );
        setConfirmDelete({ isOpen: false, userId: null });
      },
    });
  };

  if (isLoading || isLoadingRoles) return <p>Chargement...</p>;
  if (isError || isErrorRoles)
    return <p className="text-red-500">Erreur lors du chargement</p>;

  return (
    <div className="px-4 mb-10">
      <h1 className="text-lg font-semibold mb-4">Gestion des droits</h1>

      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Ajouter un utilisateur
        </h3>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <Input
              type="text"
              placeholder="Prénom"
              value={newUser.firstName}
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <Input
              type="text"
              placeholder="Nom"
              value={newUser.lastName}
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <Input
              type="password"
              placeholder="Mot de passe"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rôle</label>
            <select
              className="block w-full border p-2 rounded-md"
              value={newUser.roleId}
              onChange={(e) =>
                setNewUser({ ...newUser, roleId: Number(e.target.value) })
              }
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-center">
          <ActionButton onClick={handleAddUser}>Ajouter</ActionButton>
        </div>
      </div>

      <UserTable
        users={users}
        roles={roles}
        editUserId={editUserId}
        editedUser={editedUser}
        setEditedUser={setEditedUser}
        setEditUserId={setEditUserId}
        handleUpdateUser={handleUpdateUser}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, userId: null })}
        onConfirm={confirmDeleteUser}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
