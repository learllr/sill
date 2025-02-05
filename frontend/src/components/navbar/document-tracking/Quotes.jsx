import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";
import ScrollableDialog from "../../common/Pages/ScrollableDialog.jsx";
import QuoteFormFields from "./QuoteFormFields.jsx";
import { highlightText } from "../../../../utils/textUtils.js";

export default function Quotes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuotes = async () => {
    const response = await axios.get("/quote");
    return response.data;
  };

  const fetchParticipants = async () => {
    const response = await axios.get("/participant");
    return response.data;
  };

  const fetchProjects = async () => {
    const response = await axios.get("/project");
    return response.data;
  };

  const createQuote = useMutation(
    async (newQuote) => {
      await axios.post("/quote", newQuote);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("quotes");
        setIsDialogOpen(false);
      },
    }
  );

  const { data: quotes, isLoading, error } = useQuery("quotes", fetchQuotes);
  const { data: participants } = useQuery("participants", fetchParticipants);
  const { data: projects } = useQuery("projects", fetchProjects);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    createQuote.mutate(sanitizedData);
    reset();
  };

  const filteredQuotes = quotes?.filter((quote) => {
    return (
      quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quote.sentOn &&
        quote.sentOn.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Body>
      <div className="px-4 w-full">
        <GeneralHeaderActions
          title="Devis"
          searchValue={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onAdd={() => setIsDialogOpen(true)}
          onReset={() => setSearchTerm("")}
        />

        <ScrollableDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Ajouter un devis"
          description="Remplissez le formulaire ci-dessous pour ajouter un devis."
          onSubmit={handleSubmit(onSubmit)}
        >
          <QuoteFormFields
            register={register}
            errors={errors}
            projects={projects}
            participants={participants}
            watch={watch}
          />
        </ScrollableDialog>

        {isLoading ? (
          <p className="text-sm">Chargement des devis...</p>
        ) : error ? (
          <p className="text-red-500">
            Erreur lors de la récupération des devis.
          </p>
        ) : filteredQuotes?.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {filteredQuotes.map((quote) => (
              <li key={quote.id}>
                <button
                  onClick={() => navigate(`/devis/${quote.id}`)}
                  className="w-full text-sm flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="flex flex-col text-left">
                    <p
                      className="leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(quote.title, searchTerm),
                      }}
                    />
                    <p
                      className="text-xs text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(quote.quoteNumber, searchTerm),
                      }}
                    />
                  </div>

                  <p
                    className="text-xs text-gray-400 whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        quote.sentOn ? quote.sentOn : "Non envoyé",
                        searchTerm
                      ),
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Aucun devis trouvé.</p>
        )}
      </div>
    </Body>
  );
}
