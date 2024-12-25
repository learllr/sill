import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { highlightText } from "../../../../utils/textUtils.js";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";
import ScrollableDialog from "../../common/Pages/ScrollableDialog.jsx";

export default function Quotes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchQuotes = async () => {
    const response = await axios.get("/quote");
    return response.data;
  };

  const createQuote = useMutation(
    async (newQuote) => {
      const response = await axios.post("/quote", newQuote);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("quotes");
        setIsDialogOpen(false);
      },
    }
  );

  const { data: quotes, isLoading, error } = useQuery("quotes", fetchQuotes);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createQuote.mutate(data);
    reset();
  };

  const filteredQuotes = quotes?.filter((quote) => {
    const sentOnDate = new Date(quote.sentOn)
      .toLocaleDateString()
      .toLowerCase();
    return (
      quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sentOnDate.includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) return <Body children={<p>Chargement des devis...</p>} />;
  if (error)
    return <Body children={<p>Erreur lors de la récupération des devis.</p>} />;

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
          onClose={setIsDialogOpen}
          title="Ajouter un devis"
          description="Remplissez le formulaire ci-dessous pour ajouter un devis à la liste."
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre
            </label>
            <Input
              {...register("title", { required: "Titre requis" })}
              placeholder="Titre du devis"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de devis
            </label>
            <Input
              {...register("quoteNumber", { required: "Numéro requis" })}
              placeholder="Numéro du devis"
            />
            {errors.quoteNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.quoteNumber.message}
              </p>
            )}
          </div>
        </ScrollableDialog>

        {filteredQuotes?.length > 0 ? (
          <ul>
            {filteredQuotes.map((quote) => (
              <li key={quote.id} className="mb-2">
                <button
                  onClick={() => navigate(`/devis/${quote.id}`)}
                  className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="text-sm flex flex-col items-start">
                    <p
                      className="leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(quote.title, searchTerm),
                      }}
                    />
                    <p
                      className="text-xs text-gray-400 whitespace-nowrap"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          new Date(quote.sentOn).toLocaleDateString(),
                          searchTerm
                        ),
                      }}
                    />
                  </div>
                  <p
                    className="text-xs text-gray-400 whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(quote.quoteNumber, searchTerm),
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Aucun devis.</p>
        )}
      </div>
    </Body>
  );
}
