import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import { useUsers } from "../../../../hooks/useUsers";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";

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

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: roles?.length > 0 ? roles[0].id : 2,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    userId: null,
  });

  const handleAddUser = async () => {
    setErrorMessage("");

    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.password ||
      !newUser.roleId
    ) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    addMutation.mutate(newUser, {
      onError: (error) => {
        setErrorMessage(
          error.response?.data?.error ||
            "Erreur lors de l'ajout de l'utilisateur."
        );
      },
      onSuccess: () => {
        setNewUser({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          roleId: roles?.length > 0 ? roles[0].id : 2,
        });
      },
    });
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleUpdateUser = async () => {
    setErrorMessage("");

    if (
      !editedUser.firstName ||
      !editedUser.lastName ||
      !editedUser.email ||
      !editedUser.roleId
    ) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    updateMutation.mutate(
      { id: editUserId, updatedData: editedUser },
      {
        onError: (error) => {
          setErrorMessage(
            error.response?.data?.error ||
              "Erreur lors de la mise à jour de l'utilisateur."
          );
        },
        onSuccess: () => {
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
        setErrorMessage(
          error.response?.data?.error ||
            "Erreur lors de la suppression de l'utilisateur."
        );
      },
      onSuccess: () => {
        setConfirmDelete({ isOpen: false, userId: null });
      },
    });
  };

  if (isLoading || isLoadingRoles) return <p>Chargement...</p>;
  if (isError || isErrorRoles)
    return <p className="text-red-500">Erreur lors du chargement</p>;

  return (
    <div className="px-4 mb-10">
      {errorMessage && (
        <p className="text-red-500 text-sm mb-3 text-center">{errorMessage}</p>
      )}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Ajouter un utilisateur
        </h3>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {["Prénom", "Nom", "Email", "Mot de passe"].map((label, index) => (
            <div key={index}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <Input
                type={label === "Mot de passe" ? "password" : "text"}
                placeholder={label}
                value={newUser[label.toLowerCase()]}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    [label === "Prénom"
                      ? "firstName"
                      : label === "Nom"
                      ? "lastName"
                      : label === "Email"
                      ? "email"
                      : "password"]: e.target.value,
                  })
                }
              />
            </div>
          ))}
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
          <Button onClick={handleAddUser}>Ajouter</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Prénom</TableHead>
              <TableHead className="text-center">Nom</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Rôle</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {["firstName", "lastName", "email"].map((field) => (
                  <TableCell key={field} className="text-center">
                    {editUserId === user.id ? (
                      <Input
                        type="text"
                        value={editedUser[field]}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            [field]: e.target.value,
                          })
                        }
                      />
                    ) : (
                      user[field]
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  {editUserId === user.id ? (
                    <select
                      className="block w-full border p-2 rounded-md"
                      value={editedUser.roleId}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          roleId: Number(e.target.value),
                        })
                      }
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    roles.find((r) => r.id === user.roleId)?.name || "Inconnu"
                  )}
                </TableCell>
                <TableCell className="flex space-x-2 justify-center">
                  {editUserId === user.id ? (
                    <>
                      <Button variant="success" onClick={handleUpdateUser}>
                        <Check />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditUserId(null)}
                      >
                        <X />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
