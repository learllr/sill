import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "../../../hooks/useUsers";

export default function TeamOverview() {
  const { users, roles, isLoading, isError } = useUsers();

  if (isLoading) return <p>Chargement...</p>;
  if (isError)
    return (
      <p className="text-red-500">Erreur lors du chargement des utilisateurs</p>
    );

  const groupedUsers = roles.map((role) => ({
    roleName: role.name,
    users: users.filter((user) => user.roleId === role.id),
  }));

  return (
    <div>
      <h1 className="text-lg font-semibold px-4 ">Équipe</h1>

      <div className="space-y-6 p-4">
        {groupedUsers.map(({ roleName, users }) => (
          <div key={roleName} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{roleName}</h3>
            {users.length === 0 ? (
              <p className="text-gray-500">Aucun utilisateur</p>
            ) : (
              <Table className="w-full text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Prénom</TableHead>
                    <TableHead className="text-center">Nom</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-center">
                        {user.firstName}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.lastName}
                      </TableCell>
                      <TableCell className="text-center">
                        <a
                          href={`https://mail.orange.fr/appsuite/#!!&app=io.ox/mail&folder=default0/INBOX&to=${user.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {user.email}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
