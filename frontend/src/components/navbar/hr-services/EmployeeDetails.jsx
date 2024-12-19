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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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

  const fields = [
    {
      section: "Informations personnelles",
      items: [
        {
          label: "Prénom",
          name: "firstName",
          type: "text",
          required: true,
          value: employee?.firstName,
        },
        {
          label: "Nom",
          name: "lastName",
          type: "text",
          required: true,
          value: employee?.lastName,
        },
        {
          label: "Date de naissance",
          name: "birthDate",
          type: "date",
          isDate: true,
          value: employee?.birthDate,
        },
        {
          label: "Ville de naissance",
          name: "birthCity",
          type: "text",
          value: employee?.birthCity,
        },
        {
          label: "Nationalité",
          name: "nationality",
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
          type: "text",
          value: employee?.jobTitle,
        },
        {
          label: "Qualification",
          name: "qualification",
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
          type: "number",
          value: employee?.monthlyNetSalary,
          isPrice: true,
        },
        {
          label: "Date de début",
          name: "startDate",
          type: "date",
          isDate: true,
          value: employee?.startDate,
        },
        {
          label: "Date de fin",
          name: "endDate",
          type: "date",
          isDate: true,
          value: employee?.endDate,
        },
      ],
    },
    {
      section: "Contact",
      items: [
        {
          label: "Téléphone",
          name: "phone",
          type: "text",
          value: employee?.phone,
          isPhone: true,
        },
        {
          label: "Email",
          name: "email",
          type: "email",
          value: employee?.email,
        },
        {
          label: "Adresse",
          name: "address",
          type: "text",
          value: employee?.address,
        },
        {
          label: "Code postal",
          name: "postalCode",
          type: "text",
          value: employee?.postalCode,
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
          backUrl="/employees"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="p-4 border border-gray-300 bg-white">
          {isEditing ? (
            <DynamicForm
              fields={fields}
              register={register}
              errors={errors}
              onSubmit={handleSubmit(onSubmit)}
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
