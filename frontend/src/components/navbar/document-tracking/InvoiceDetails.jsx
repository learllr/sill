import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";
import DetailsDisplay from "../../common/Pages/DetailsDisplay.jsx";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions.jsx";
import DynamicForm from "../../common/Pages/DynamicForm";

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const fetchInvoiceById = async () => {
    const response = await axios.get(`/invoice/${id}`);
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
        navigate("/invoices");
      },
    }
  );

  const {
    data: invoice,
    isLoading,
    error,
  } = useQuery(["invoice", id], fetchInvoiceById);

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
    updateInvoice.mutate(data);
  };

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
          value: invoice?.title,
        },
        {
          label: "Numéro de la facture",
          name: "invoiceNumber",
          type: "text",
          value: invoice?.invoiceNumber,
        },
        {
          label: "Participant ID",
          name: "participantId",
          type: "number",
          value: invoice?.participantId,
        },
        {
          label: "Project ID",
          name: "projectId",
          type: "number",
          value: invoice?.projectId,
        },
        {
          label: "Lot",
          name: "lot",
          type: "text",
          value: invoice?.lot,
        },
        {
          label: "Date de paiement",
          name: "paidOn",
          type: "date",
          isDate: true,
          value: invoice?.paidOn,
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

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title={invoice?.title}
          navigateBack={navigate}
          backUrl="/invoices"
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
