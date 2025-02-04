import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";
import DetailsDisplay from "../../common/Pages/DetailsDisplay.jsx";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions.jsx";
import DynamicForm from "../../common/Pages/DynamicForm";
import { getTypeName } from "../../../../utils/typeUtils.js";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const fetchInvoiceById = async () => {
    const response = await axios.get(`/invoice/${id}`);
    return response.data;
  };

  const fetchParticipants = async () => {
    const typeIds = [1, 2, 3, 4];
    const responses = await Promise.all(
      typeIds.map((typeId) => axios.get(`/participant/${typeId}`))
    );
    return responses.flatMap((response) => response.data);
  };

  const fetchProjects = async () => {
    const response = await axios.get("/project");
    return response.data;
  };

  const updateInvoice = useMutation(
    async (updatedInvoice) => {
      const response = await axios.put(`/invoice/${id}`, updatedInvoice);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["invoice", id]);
        setIsEditing(false);
      },
    }
  );

  const deleteInvoice = useMutation(
    async () => {
      await axios.delete(`/invoice/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invoices");
        navigate("/factures");
      },
    }
  );

  const {
    data: invoice,
    isLoading,
    error,
  } = useQuery(["invoice", id], fetchInvoiceById);

  const { data: participants, isLoading: isLoadingParticipants } = useQuery(
    "participants",
    fetchParticipants
  );

  const { data: projects, isLoading: isLoadingProjects } = useQuery(
    "projects",
    fetchProjects
  );

  const {
    register,
    reset,
    formState: { errors },
  } = useForm();

  const handleEdit = () => {
    reset(invoice);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      deleteInvoice.mutate();
    }
  };

  const fields = [
    {
      items: [
        {
          label: "Titre",
          name: "title",
          type: "text",
          required: true,
          value: invoice?.title || "",
        },
        {
          label: "Numéro de la facture",
          name: "invoiceNumber",
          type: "text",
          value: invoice?.invoiceNumber || "",
        },
        {
          label: "Participant",
          name: "participantId",
          type: "combobox",
          value: invoice?.participantId || "",
          comboboxOptions: participants?.map((p) => ({
            value: p.id,
            label: p.name,
          })),
          link: invoice?.participantId
            ? `/${getTypeName(
                participants?.find((p) => p.id === invoice.participantId)
                  ?.typeId,
                false
              )}/${invoice.participantId}`
            : null,
        },
        {
          label: "Projet",
          name: "projectId",
          type: "combobox",
          value: invoice?.projectId || "",
          comboboxOptions: projects?.map((p) => ({
            value: p.id,
            label: p.name,
          })),
          link: invoice?.projectId ? `/chantier/${invoice.projectId}` : null,
        },
        {
          label: "Lot",
          name: "lot",
          type: "text",
          value: invoice?.lot || "",
        },
        {
          label: "Date de paiement",
          name: "paidOn",
          type: "text",
          isDate: true,
          value: invoice?.paidOn || "",
        },
        {
          label: "Remarques",
          name: "remarks",
          type: "textarea",
          value: invoice?.remarks || "Aucune",
        },
      ],
    },
  ];

  if (isLoading || isLoadingParticipants || isLoadingProjects)
    return (
      <Body children={<p className="text-sm">Chargement des données...</p>} />
    );

  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des détails.</p>} />
    );

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title={invoice?.title}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="p-4 border border-gray-300 bg-white">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Détails de la facture
          </h1>

          {isEditing ? (
            <DynamicForm
              fields={fields}
              register={register}
              errors={errors}
              onSubmit={(data) => {
                updateInvoice.mutate(data);
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
