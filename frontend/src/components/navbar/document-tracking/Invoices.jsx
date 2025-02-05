import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { highlightText } from "../../../../utils/textUtils.js";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";
import DynamicForm from "../../common/Pages/DynamicForm.jsx";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";
import ScrollableDialog from "../../common/Pages/ScrollableDialog.jsx";

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
      const response = await axios.post("/invoice", newInvoice);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("invoices");
        setIsDialogOpen(false);
      },
      onError: (error) => {
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
    createInvoice.mutate(data);
    reset();
  };

  const filteredInvoices = invoices?.filter((invoice) => {
    const paidOnDate = new Date(invoice.paidOn)
      .toLocaleDateString()
      .toLowerCase();
    return (
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paidOnDate.includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading || isLoadingParticipants || isLoadingProjects)
    return (
      <Body children={<p className="text-sm">Chargement des factures...</p>} />
    );
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des factures.</p>} />
    );

  const fields = [
    {
      items: [
        {
          label: "Titre",
          name: "title",
          type: "text",
          required: true,
        },
        {
          label: "Numéro de facture",
          name: "invoiceNumber",
          type: "text",
          required: true,
        },
        {
          label: "Payé le",
          name: "paidOn",
          type: "text",
          isDate: true,
        },
        {
          label: "Chantier",
          name: "projectId",
          type: "combobox",
          value: 0,
          comboboxOptions: projects?.map((p) => ({
            value: p.id,
            label: p.name,
          })),
        },
        {
          label: "Participant",
          name: "participantId",
          type: "combobox",
          value: 0,
          comboboxOptions: participants?.map((p) => ({
            value: p.id,
            label: p.name,
          })),
        },
        {
          label: "Description",
          name: "description",
          type: "textarea",
        },
      ],
    },
  ];

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
          onClose={setIsDialogOpen}
          title="Ajouter une facture"
          description="Remplissez le formulaire ci-dessous pour ajouter une facture à la liste."
          onSubmit={handleSubmit(onSubmit)}
        >
          <DynamicForm
            fields={fields}
            register={register}
            errors={errors}
            isDialog={true}
            onSubmit={(data) => {
              updateInvoice.mutate(data);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </ScrollableDialog>

        {filteredInvoices?.length > 0 ? (
          <ul>
            {filteredInvoices.map((invoice) => (
              <li key={invoice.id} className="mb-2">
                <button
                  onClick={() => navigate(`/facture/${invoice.id}`)}
                  className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="text-sm flex flex-col items-start">
                    <p
                      className="leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(invoice.title, searchTerm),
                      }}
                    />
                    <p
                      className="text-xs text-gray-400 whitespace-nowrap"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          new Date(invoice.paidOn).toLocaleDateString(),
                          searchTerm
                        ),
                      }}
                    />
                  </div>
                  <p
                    className="text-xs text-gray-400 whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(invoice.invoiceNumber, searchTerm),
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
