import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";
import ScrollableDialog from "../../common/Pages/ScrollableDialog.jsx";
import InvoiceFormFields from "./InvoiceFormFields.jsx";
import { highlightText } from "../../../../utils/textUtils.js";

export default function Invoices() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInvoices = async () => {
    const response = await axios.get("/invoice");
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

  const createInvoice = useMutation(
    async (newInvoice) => {
      await axios.post("/invoice", newInvoice);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invoices");
        setIsDialogOpen(false);
      },
      onError: () => {
        alert("Erreur : Impossible de créer la facture. Vérifiez les données.");
      },
    }
  );

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery("invoices", fetchInvoices);
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
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    createInvoice.mutate(sanitizedData);
    reset();
  };

  const filteredInvoices = invoices?.filter((invoice) => {
    return (
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.paidOn &&
        invoice.paidOn.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Body>
      <div className="px-4 w-full">
        <GeneralHeaderActions
          title="Factures"
          searchValue={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onAdd={() => setIsDialogOpen(true)}
          onReset={() => setSearchTerm("")}
        />

        <ScrollableDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Ajouter une facture"
          description="Remplissez le formulaire ci-dessous pour ajouter une facture à la liste."
          onSubmit={handleSubmit(onSubmit)}
        >
          <InvoiceFormFields
            register={register}
            errors={errors}
            projects={projects}
            participants={participants}
          />
        </ScrollableDialog>

        {isLoading || isLoadingParticipants || isLoadingProjects ? (
          <p className="text-sm">Chargement des factures...</p>
        ) : error ? (
          <p className="text-red-500">
            Erreur lors de la récupération des factures.
          </p>
        ) : filteredInvoices?.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {filteredInvoices.map((invoice) => (
              <li key={invoice.id}>
                <button
                  onClick={() => navigate(`/facture/${invoice.id}`)}
                  className="w-full text-sm flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex flex-col text-left">
                    <p
                      className="leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(invoice.title, searchTerm),
                      }}
                    />
                    <p
                      className="text-xs text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          invoice.invoiceNumber,
                          searchTerm
                        ),
                      }}
                    />
                  </div>

                  <p
                    className="text-xs text-gray-400 whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        invoice.paidOn ? invoice.paidOn : "Non payé",
                        searchTerm
                      ),
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Aucune facture.</p>
        )}
      </div>
    </Body>
  );
}
