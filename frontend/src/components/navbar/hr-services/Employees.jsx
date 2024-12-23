import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";

export default function Employees() {
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const response = await axios.get("/employee");
    return response.data;
  };

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery("employees", fetchEmployees);

  if (isLoading) return <Body children={<p>Chargement des salariés...</p>} />;
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des salariés.</p>} />
    );

  return (
    <Body
      children={
        <div className="flex justify-center items-center">
          <div className="px-4 w-full">
            <h1 className="text-2xl font-semibold mb-6">Liste des salariés</h1>
            {employees.length > 0 ? (
              <ul>
                {employees.map((employee) => (
                  <li key={employee.id} className="mb-2">
                    <button
                      onClick={() => navigate(`/salarié/${employee.id}`)}
                      className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                      <div className="text-sm flex flex-col items-start">
                        <p className="leading-tight">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs">{employee.jobTitle}</p>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Aucun salarié.</p>
            )}
          </div>
        </div>
      }
    />
  );
}
