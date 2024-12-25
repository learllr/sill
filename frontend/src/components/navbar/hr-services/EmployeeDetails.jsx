import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";
import DetailsDisplay from "../../common/Pages/DetailsDisplay";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions";
import DynamicForm from "../../common/Pages/DynamicForm";

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
      console.log(updateEmployee);
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
        navigate("/salariés");
      },
    }
  );

  const {
    data: employee,
    isLoading,
    error,
  } = useQuery(["employee", id], fetchEmployeeById);

  const { reset } = useForm();

  if (isLoading)
    return (
      <Body children={<p className="text-sm">Chargement des détails...</p>} />
    );
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des détails.</p>} />
    );

  const handleEdit = () => {
    reset(employee);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce salarié ?")) {
      deleteEmployee.mutate();
    }
  };

  const fields = [
    {
      section: "Informations personnelles",
      items: [
        {
          label: "Prénom",
          name: "firstName",
          placeholder: "John",
          type: "text",
          required: true,
          value: employee?.firstName,
        },
        {
          label: "Nom",
          name: "lastName",
          placeholder: "Doe",
          type: "text",
          required: true,
          value: employee?.lastName,
        },
        {
          label: "Date de naissance",
          name: "birthDate",
          placeholder: "JJ/MM/AAAA",
          type: "text",
          value: employee?.birthDate,
          isDate: true,
        },
        {
          label: "Ville de naissance",
          name: "birthCity",
          placeholder: "Paris",
          type: "text",
          value: employee?.birthCity,
        },
        {
          label: "Nationalité",
          name: "nationality",
          placeholder: "Française",
          type: "text",
          value: employee?.nationality,
        },
      ],
    },
    {
      section: "Détails professionnels",
      items: [
        {
          label: "Poste",
          name: "jobTitle",
          placeholder: "Assistant RH",
          type: "text",
          value: employee?.jobTitle,
        },
        {
          label: "Qualification",
          name: "qualification",
          placeholder: "Bac +3",
          type: "text",
          value: employee?.qualification,
        },
        {
          label: "Type de contrat",
          name: "contractType",
          type: "select",
          options: [
            { value: "CDD", label: "CDD" },
            { value: "CDI", label: "CDI" },
            {
              value: "Contrat d'apprentissage",
              label: "Contrat d'apprentissage",
            },
            {
              value: "Contrat de professionnalisation",
              label: "Contrat de professionnalisation",
            },
          ],
          value: employee?.contractType,
        },
        {
          label: "Salaire net mensuel",
          name: "monthlyNetSalary",
          placeholder: "1500",
          type: "number",
          value: employee?.monthlyNetSalary,
          isPrice: true,
        },
        {
          label: "Date de début",
          name: "startDate",
          placeholder: "JJ/MM/AAAA",
          type: "text",
          value: employee?.startDate,
          isDate: true,
        },
        {
          label: "Date de fin",
          name: "endDate",
          placeholder: "JJ/MM/AAAA",
          type: "text",
          value: employee?.endDate,
          isDate: true,
        },
      ],
    },
    {
      section: "Contact",
      items: [
        {
          label: "Téléphone",
          name: "phone",
          placeholder: "0601020304",
          type: "text",
          value: employee?.phone,
          isPhone: true,
        },
        {
          label: "Email",
          name: "email",
          placeholder: "example@example.com",
          type: "email",
          value: employee?.email,
        },
        {
          label: "Adresse",
          name: "address",
          placeholder: "12 Rue de Paris",
          type: "text",
          value: employee?.address,
        },
        {
          label: "Code postal",
          name: "postalCode",
          placeholder: "75000",
          type: "text",
          value: employee?.postalCode,
          isPostalCode: true,
        },
        { label: "Ville", name: "city", type: "text", value: employee?.city },
      ],
    },
  ];

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title={`${employee?.firstName} ${employee?.lastName}`}
          navigateBack={navigate}
          backUrl="/salariés"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <div className="p-4 border border-gray-300 bg-white">
          {isEditing ? (
            <DynamicForm
              fields={fields}
              onSubmit={(data) => {
                updateEmployee.mutate(data);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <DetailsDisplay data={fields} />
          )}
        </div>
      </div>
    </Body>
  );
}
