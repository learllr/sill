import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";
import DetailsDisplay from "../../common/Pages/DetailsDisplay";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions";
import DynamicForm from "../../common/Pages/DynamicForm";

export default function QuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const fetchQuoteById = async () => {
    const response = await axios.get(`/quote/${id}`);
    return response.data;
  };

  const updateQuote = useMutation(
    async (updatedQuote) => {
      const response = await axios.put(`/quote/${id}`, updatedQuote);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["quote", id]);
        setIsEditing(false);
      },
    }
  );

  const deleteQuote = useMutation(
    async () => {
      await axios.delete(`/quote/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("quotes");
        navigate("/devis");
      },
    }
  );

  const {
    data: quote,
    isLoading,
    error,
  } = useQuery(["quote", id], fetchQuoteById);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  if (isLoading)
    return (
      <Body children={<p className="text-sm">Chargement des détails...</p>} />
    );
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des détails.</p>} />
    );

  const onSubmit = (data) => {
    updateQuote.mutate(data);
  };

  const handleEdit = () => {
    reset(quote);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      deleteQuote.mutate();
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
          value: quote?.title,
        },
        {
          label: "Numéro du devis",
          name: "quoteNumber",
          type: "text",
          value: quote?.quoteNumber,
        },
        {
          label: "Statut",
          name: "status",
          type: "select",
          options: [
            { value: "En attente", label: "En attente" },
            { value: "Accepté", label: "Accepté" },
            { value: "Rejeté", label: "Rejeté" },
          ],
          value: quote?.status,
        },
        {
          label: "Participant",
          name: "participant",
          type: "text",
          value: quote?.participant?.name || "Inconnu",
          readOnly: true,
        },
        {
          label: "Projet",
          name: "project",
          type: "text",
          value: quote?.project?.name || "Inconnu",
          readOnly: true,
        },
        {
          label: "Lot",
          name: "lot",
          type: "text",
          value: quote?.lot,
        },
        {
          label: "Date d'envoi",
          name: "sentOn",
          type: "text",
          isDate: true,
          value: quote?.sentOn,
        },
        {
          label: "Remarques",
          name: "remarks",
          type: "textarea",
          value: quote?.remarks || "Aucune",
        },
      ],
    },
  ];

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title={quote?.title}
          navigateBack={navigate}
          backUrl="/devis"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="p-4 border border-gray-300 bg-white">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Détails du devis
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
