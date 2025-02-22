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

export default function UserTable({
  users,
  roles,
  editUserId,
  editedUser,
  setEditedUser,
  setEditUserId,
  handleUpdateUser,
  handleEditUser,
  handleDeleteUser,
}) {
  return (
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
  );
}
