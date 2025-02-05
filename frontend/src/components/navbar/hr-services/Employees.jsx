import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";
import ScrollableDialog from "../../common/Pages/ScrollableDialog.jsx";
import EmployeeFormFields from "./EmployeeFormFields.jsx";
import { highlightText } from "../../../../utils/textUtils.js";

export default function Employees() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchEmployees = async () => {
    const response = await axios.get("/employee");
    return response.data;
  };

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery("employees", fetchEmployees);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createEmployee = useMutation(
    async (employeeData) => {
      await axios.post("/employee", employeeData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employees");
        setIsDialogOpen(false);
        reset();
      },
      onError: () => {
        alert("Erreur : Impossible d'ajouter le salarié.");
      },
    }
  );

  const onSubmit = (data) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    createEmployee.mutate(sanitizedData);
  };

  const filteredEmployees = employees?.filter((employee) => {
    return (
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Body>
      <div className="px-4 w-full">
        <GeneralHeaderActions
          title="Salariés"
          searchValue={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onAdd={() => setIsDialogOpen(true)}
          onReset={() => setSearchTerm("")}
        />

        <ScrollableDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Ajouter un salarié"
          description="Remplissez les informations du nouveau salarié."
          onSubmit={handleSubmit(onSubmit)}
        >
          <EmployeeFormFields register={register} errors={errors} />
        </ScrollableDialog>

        {isLoading ? (
          <p className="text-sm">Chargement des salariés...</p>
        ) : error ? (
          <p className="text-red-500">
            Erreur lors de la récupération des salariés.
          </p>
        ) : filteredEmployees?.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {filteredEmployees.map((employee) => (
              <li key={employee.id}>
                <button
                  onClick={() => navigate(`/salarié/${employee.id}`)}
                  className="w-full text-sm flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <p
                    className="leading-tight"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        `${employee.firstName} ${employee.lastName}`,
                        searchTerm
                      ),
                    }}
                  />
                  <p
                    className="text-xs text-gray-400 whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        employee.email || "Aucun email",
                        searchTerm
                      ),
                    }}
                  />
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
