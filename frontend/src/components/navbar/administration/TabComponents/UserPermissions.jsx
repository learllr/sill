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
    isLoading,
    isError,
    addMutation,
    updateMutation,
    deleteMutation,
  } = useUsers();
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: 2,
  });
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    userId: null,
  });

  const handleAddUser = () => {
    console.log(newUser);
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.password
    ) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    addMutation.mutate(newUser);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roleId: 2,
    });
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleUpdateUser = () => {
    Object.keys(editedUser).forEach((field) => {
      if (editedUser[field] !== users.find((u) => u.id === editUserId)[field]) {
        updateMutation.mutate({
          id: editUserId,
          field,
          value: editedUser[field],
        });
      }
    });
    setEditUserId(null);
  };

  const handleDeleteUser = (userId) => {
    setConfirmDelete({ isOpen: true, userId });
  };

  const confirmDeleteUser = () => {
    deleteMutation.mutate(confirmDelete.userId);
    setConfirmDelete({ isOpen: false, userId: null });
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement</p>;

  return (
    <div className="p-4 mb-14">
      <div className="mb-6 p-4 border rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Ajouter un utilisateur</h3>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {["Prénom", "Nom", "Email", "Mot de passe", "Rôle"].map(
            (label, index) => (
              <div key={index}>
                <label className="block text-sm font-medium mb-1">
                  {label}
                </label>
                <Input
                  type={
                    label === "Mot de passe"
                      ? "password"
                      : label === "Rôle"
                      ? "number"
                      : "text"
                  }
                  placeholder={label}
                  value={
                    newUser[
                      label === "Prénom"
                        ? "firstName"
                        : label === "Nom"
                        ? "lastName"
                        : label === "Email"
                        ? "email"
                        : label === "Mot de passe"
                        ? "password"
                        : "roleId"
                    ]
                  }
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      [label === "Prénom"
                        ? "firstName"
                        : label === "Nom"
                        ? "lastName"
                        : label === "Email"
                        ? "email"
                        : label === "Mot de passe"
                        ? "password"
                        : "roleId"]:
                        label === "Nom"
                          ? e.target.value.toUpperCase()
                          : e.target.value,
                    })
                  }
                />
              </div>
            )
          )}
        </div>
        <div className="mt-4 text-center">
          <Button onClick={handleAddUser}>Ajouter</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full text-center">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 text-center">Prénom</TableHead>
              <TableHead className="w-1/5 text-center">Nom</TableHead>
              <TableHead className="w-1/3 text-center">Email</TableHead>
              <TableHead className="w-1/6 text-center">Rôle</TableHead>
              <TableHead className="w-1/6 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                {["firstName", "lastName", "email", "roleId"].map((field) => (
                  <TableCell key={field} className="w-1/5">
                    {editUserId === user.id ? (
                      <Input
                        type={field === "roleId" ? "number" : "text"}
                        value={editedUser[field]}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            [field]:
                              field === "lastName"
                                ? e.target.value.toUpperCase()
                                : e.target.value,
                          })
                        }
                      />
                    ) : (
                      user[field]
                    )}
                  </TableCell>
                ))}
                <TableCell className="w-1/6 flex space-x-2">
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
