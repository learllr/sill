import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";

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
        navigate("/quotes");
      },
    }
  );

  const {
    data: quote,
    isLoading,
    error,
  } = useQuery(["quote", id], fetchQuoteById);

  const { register, handleSubmit, reset } = useForm();

  if (isLoading) return <Body children={<p>Chargement des détails...</p>} />;
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

  return (
    <Body>
      <div className="px-4 w-full">
        <div className="flex justify-between items-center mb-4 border-gray-300">
          <div className="flex flex-row space-x-3 items-center">
            <ArrowLeft
              className="text-xl cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => navigate("/quotes")}
            />
            <h1 className="text-2xl font-semibold">{quote.title}</h1>
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
            Détails du devis
          </h1>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Titre :
                </label>
                <input
                  {...register("title", { required: true })}
                  defaultValue={quote.title}
                  type="text"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Numéro du devis :
                </label>
                <input
                  {...register("quoteNumber", { required: true })}
                  defaultValue={quote.quoteNumber}
                  type="text"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Statut :
                </label>
                <select
                  {...register("status")}
                  defaultValue={quote.status}
                  className="py-2 px-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                >
                  <option value="En attente">En attente</option>
                  <option value="Accepté">Accepté</option>
                  <option value="Rejeté">Rejeté</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Participant ID :
                </label>
                <input
                  {...register("participantId")}
                  defaultValue={quote.participantId}
                  type="number"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Project ID :
                </label>
                <input
                  {...register("projectId")}
                  defaultValue={quote.projectId}
                  type="number"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Lot :
                </label>
                <input
                  {...register("lot")}
                  defaultValue={quote.lot}
                  type="text"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date d'envoi :
                </label>
                <input
                  {...register("sentOn")}
                  defaultValue={quote.sentOn}
                  type="date"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Remarques :
                </label>
                <textarea
                  {...register("remarks")}
                  defaultValue={quote.remarks}
                  rows={4}
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
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
                <strong>Numéro du devis :</strong> {quote.quoteNumber}
              </li>
              <li>
                <strong>Statut :</strong> {quote.status}
              </li>
              <li>
                <strong>Participant ID :</strong> {quote.participantId}
              </li>
              <li>
                <strong>Project ID :</strong> {quote.projectId}
              </li>
              <li>
                <strong>Lot :</strong> {quote.lot || "Non spécifié"}
              </li>
              <li>
                <strong>Date d'envoi :</strong>{" "}
                {quote.sentOn
                  ? new Date(quote.sentOn).toLocaleDateString("fr-FR")
                  : "Non spécifiée"}
              </li>
              <li>
                <strong>Remarques :</strong> {quote.remarks || "Aucune"}
              </li>
            </ul>
          )}
        </div>
      </div>
    </Body>
  );
}
