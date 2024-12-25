import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { highlightText } from "../../../../utils/textUtils.js";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";

export default function Employees() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmployees = async () => {
    const response = await axios.get("/employee");
    return response.data;
  };

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery("employees", fetchEmployees);

  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Body children={<p>Chargement des salariés...</p>} />;
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des salariés.</p>} />
    );

  return (
    <Body>
      <div className="px-4 w-full">
        <GeneralHeaderActions
          title="Salariés"
          searchValue={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onAdd={() => console.log("Ajout d'un salarié")}
          onReset={() => setSearchTerm("")}
        />

        {filteredEmployees?.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {filteredEmployees.map((employee) => (
              <li key={employee.id}>
                <button
                  onClick={() => navigate(`/salarié/${employee.id}`)}
                  className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="text-sm flex flex-col items-start">
                    <p
                      className="leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: `${highlightText(
                          `${employee.firstName} ${employee.lastName}`,
                          searchTerm
                        )}`,
                      }}
                    />
                    <p
                      className="text-xs text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          employee.jobTitle || "Poste inconnu",
                          searchTerm
                        ),
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Aucun salarié trouvé.</p>
        )}
      </div>
    </Body>
  );
}
