import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions";

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

  const { register, handleSubmit, reset } = useForm();

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

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title={invoice.title}
          navigateBack={navigate}
          backUrl="/invoices"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="p-4 border border-gray-300 bg-white">
          <h1 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b">
            Détails de la facture
          </h1>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Titre :
                </label>
                <input
                  {...register("title", { required: true })}
                  defaultValue={invoice.title}
                  type="text"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Numéro de la facture :
                </label>
                <input
                  {...register("invoiceNumber", { required: true })}
                  defaultValue={invoice.invoiceNumber}
                  type="text"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Participant ID :
                </label>
                <input
                  {...register("participantId")}
                  defaultValue={invoice.participantId}
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
                  defaultValue={invoice.projectId}
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
                  defaultValue={invoice.lot}
                  type="text"
                  className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date de paiement :
                </label>
                <input
                  {...register("paidOn")}
                  defaultValue={invoice.paidOn}
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
                  defaultValue={invoice.remarks}
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
                <strong>Numéro de la facture :</strong> {invoice.invoiceNumber}
              </li>
              <li>
                <strong>Participant ID :</strong> {invoice.participantId}
              </li>
              <li>
                <strong>Project ID :</strong> {invoice.projectId}
              </li>
              <li>
                <strong>Lot :</strong> {invoice.lot || "Non spécifié"}
              </li>
              <li>
                <strong>Date de paiement :</strong>{" "}
                {invoice.paidOn
                  ? new Date(invoice.paidOn).toLocaleDateString("fr-FR")
                  : "Non spécifiée"}
              </li>
              <li>
                <strong>Remarques :</strong> {invoice.remarks || "Aucune"}
              </li>
            </ul>
          )}
        </div>
      </div>
    </Body>
  );
}
