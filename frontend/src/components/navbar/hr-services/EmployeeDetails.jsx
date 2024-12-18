import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const fetchEmployeeById = async () => {
    const response = await axios.get(`/employee/${id}`);
    return response.data;
  };

  const updateEmployee = useMutation(
    async (updatedEmployee) => {
      const response = await axios.put(`/employee/${id}`, updatedEmployee);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employee", id]);
        setIsEditing(false);
      },
    }
  );

  const deleteEmployee = useMutation(
    async () => {
      await axios.delete(`/employee/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employees");
        navigate("/employees");
      },
    }
  );

  const {
    data: employee,
    isLoading,
    error,
  } = useQuery(["employee", id], fetchEmployeeById);

  const { register, handleSubmit, reset, setValue } = useForm();

  if (isLoading) return <Body children={<p>Chargement des détails...</p>} />;
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des détails.</p>} />
    );

  const onSubmit = (data) => {
    updateEmployee.mutate(data);
  };

  const handleEdit = () => {
    reset(employee);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      deleteEmployee.mutate();
    }
  };

  return (
    <Body
      children={
        <div className="px-4 w-full">
          <div className="flex justify-between items-center mb-4 border-gray-300 ">
            <div className="flex flex-row space-x-3 items-center">
              <ArrowLeft
                className="text-xl cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => navigate("/employees")}
              />
              <h1 className="text-2xl font-semibold">
                {employee.firstName} {employee.lastName}
              </h1>
            </div>
            <div className="flex space-x-4">
              <Button onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button onClick={handleDelete} variant="destructive">
                <Trash className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>

          <div className="p-4 border border-gray-300 bg-white">
            <h1 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">
              Informations
            </h1>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Prénom :
                  </label>
                  <input
                    {...register("firstName", { required: true })}
                    defaultValue={employee.firstName}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Nom :
                  </label>
                  <input
                    {...register("lastName", { required: true })}
                    defaultValue={employee.lastName}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Date de naissance :
                  </label>
                  <input
                    {...register("birthDate")}
                    defaultValue={employee.birthDate}
                    type="date"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Ville de naissance :
                  </label>
                  <input
                    {...register("birthCity")}
                    defaultValue={employee.birthCity}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Nationalité :
                  </label>
                  <input
                    {...register("nationality")}
                    defaultValue={employee.nationality}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Statut familial :
                  </label>
                  <select
                    {...register("familyStatus")}
                    defaultValue={employee.familyStatus}
                    className="py-2 px-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  >
                    <option value="Célibataire">Célibataire</option>
                    <option value="Marié">Marié</option>
                    <option value="Vie maritale">Vie maritale</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Nombre d'enfants :
                  </label>
                  <input
                    {...register("dependentChildren")}
                    defaultValue={employee.dependentChildren}
                    type="number"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Numéro de sécurité sociale :
                  </label>
                  <input
                    {...register("socialSecurityNumber")}
                    defaultValue={employee.socialSecurityNumber}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Adresse :
                  </label>
                  <input
                    {...register("address")}
                    defaultValue={employee.address}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Code postal :
                  </label>
                  <input
                    {...register("postalCode")}
                    defaultValue={employee.postalCode}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Ville :
                  </label>
                  <input
                    {...register("city")}
                    defaultValue={employee.city}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Téléphone :
                  </label>
                  <input
                    {...register("phone")}
                    defaultValue={employee.phone}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Email :
                  </label>
                  <input
                    {...register("email")}
                    defaultValue={employee.email}
                    type="email"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Poste :
                  </label>
                  <input
                    {...register("jobTitle")}
                    defaultValue={employee.jobTitle}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Qualification :
                  </label>
                  <input
                    {...register("qualification")}
                    defaultValue={employee.qualification}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Type de contrat :
                  </label>
                  <select
                    {...register("contractType")}
                    defaultValue={employee.contractType}
                    className="py-2 px-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  >
                    <option value="CDD">CDD</option>
                    <option value="CDI">CDI</option>
                    <option value="Contrat d'apprentissage">
                      Contrat d'apprentissage
                    </option>
                    <option value="Contrat de professionnalisation">
                      Contrat de professionnalisation
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Salaire net mensuel :
                  </label>
                  <input
                    {...register("monthlyNetSalary")}
                    defaultValue={employee.monthlyNetSalary}
                    type="number"
                    step="0.01"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Date de début :
                  </label>
                  <input
                    {...register("startDate")}
                    defaultValue={employee.startDate}
                    type="date"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Date de fin :
                  </label>
                  <input
                    {...register("endDate")}
                    defaultValue={employee.endDate}
                    type="date"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    Actif :
                  </label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        {...register("active", {
                          setValueAs: (v) => v === "true",
                        })}
                        type="radio"
                        value="true"
                        defaultChecked={employee.active === true}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span>Oui</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        {...register("active", {
                          setValueAs: (v) => v === "false",
                        })}
                        type="radio"
                        value="false"
                        defaultChecked={employee.active === false}
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span>Non</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="secondary"
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Enregistrer</Button>
                </div>
              </form>
            ) : (
              <ul className="space-y-4 text-sm">
                <li>
                  <strong>Prénom :</strong> {employee.firstName}
                </li>
                <li>
                  <strong>Nom :</strong> {employee.lastName}
                </li>
                <li>
                  <strong>Date de naissance :</strong>{" "}
                  {employee.birthDate
                    ? new Date(employee.birthDate).toLocaleDateString("fr-FR")
                    : "Non spécifiée"}
                </li>
                <li>
                  <strong>Ville de naissance :</strong> {employee.birthCity}
                </li>
                <li>
                  <strong>Nationalité :</strong> {employee.nationality}
                </li>
                <li>
                  <strong>Statut familial :</strong> {employee.familyStatus}
                </li>
                <li>
                  <strong>Nombre d'enfants :</strong>{" "}
                  {employee.dependentChildren}
                </li>
                <li>
                  <strong>Numéro de sécurité sociale :</strong>{" "}
                  {employee.socialSecurityNumber}
                </li>
                <li>
                  <strong>Adresse :</strong> {employee.address}
                </li>
                <li>
                  <strong>Code postal :</strong> {employee.postalCode}
                </li>
                <li>
                  <strong>Ville :</strong> {employee.city}
                </li>
                <li>
                  <strong>Téléphone :</strong> {employee.phone}
                </li>
                <li>
                  <strong>Email :</strong> {employee.email}
                </li>
                <li>
                  <strong>Poste :</strong> {employee.jobTitle}
                </li>
                <li>
                  <strong>Qualification :</strong> {employee.qualification}
                </li>
                <li>
                  <strong>Type de contrat :</strong> {employee.contractType}
                </li>
                <li>
                  <strong>Salaire net mensuel :</strong>{" "}
                  {employee.monthlyNetSalary} €
                </li>
                <li>
                  <strong>Date de début :</strong>{" "}
                  {employee.startDate || "Non spécifiée"}
                </li>
                <li>
                  <strong>Date de fin :</strong>{" "}
                  {employee.endDate || "Non spécifiée"}
                </li>
                <li>
                  <strong>Actif :</strong> {employee.active ? "Oui" : "Non"}
                </li>
              </ul>
            )}
          </div>
        </div>
      }
    />
  );
}
