import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { highlightText } from "../../../../utils/textUtils.js";
import { getTypeName } from "../../../../utils/typeUtils.js";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";
import ScrollableDialog from "../../common/Pages/ScrollableDialog.jsx";

export default function Participants({ typeId }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const titlePlural = getTypeName(typeId, true);
  const titleSingular = getTypeName(typeId, false);

  const fetchParticipants = async () => {
    const response = await axios.get(`/participant/${typeId}`);
    return response.data;
  };

  const createParticipant = useMutation(
    async (newParticipant) => {
      const response = await axios.post(`/participant`, {
        ...newParticipant,
        typeId,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["participants", typeId]);
        setIsDialogOpen(false);
      },
    }
  );

  const {
    data: participants,
    isLoading,
    error,
  } = useQuery(["participants", typeId], fetchParticipants);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createParticipant.mutate(data);
  };

  const filteredParticipants = participants?.filter((participant) => {
    const createdDate = new Date(participant.createdAt)
      .toLocaleDateString()
      .toLowerCase();

    return (
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.contactPerson
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      createdDate.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Body>
      <div className="px-4 w-full">
        <GeneralHeaderActions
          title={titlePlural}
          searchValue={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onAdd={() => setIsDialogOpen(true)}
          onReset={() => setSearchTerm("")}
        />

        <ScrollableDialog
          isOpen={isDialogOpen}
          onClose={setIsDialogOpen}
          title={`Ajouter un ${titleSingular.toLowerCase()}`}
          description={`Remplissez le formulaire ci-dessous pour ajouter un ${titleSingular.toLowerCase()} à la liste.`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <Input
              {...register("name", { required: "Nom requis" })}
              placeholder={`Nom ${titleSingular.toLowerCase()}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interlocuteur
            </label>
            <Input
              {...register("contactPerson")}
              placeholder="Interlocuteur principal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <Input {...register("phone")} placeholder="Numéro de téléphone" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email invalide",
                },
              })}
              placeholder="Adresse email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <Input {...register("address")} placeholder="Adresse" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site web
            </label>
            <Input {...register("website")} placeholder="Site web" />
          </div>
        </ScrollableDialog>

        {isLoading ? (
          <p>Chargement des {titlePlural.toLowerCase()}...</p>
        ) : error ? (
          <p className="text-red-500">
            Erreur lors de la récupération des {titlePlural.toLowerCase()}.
          </p>
        ) : filteredParticipants?.length > 0 ? (
          <ul>
            {filteredParticipants.map((participant) => (
              <li key={participant.id} className="mb-2">
                <button
                  onClick={() =>
                    navigate(
                      `/${getTypeName(typeId, false).toLowerCase()}/${
                        participant.id
                      }`
                    )
                  }
                  className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="text-sm flex flex-col items-start">
                    <p
                      className="leading-tight"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(participant.name, searchTerm),
                      }}
                    />
                    <p
                      className="text-xs text-gray-400"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(
                          participant.contactPerson || "",
                          searchTerm
                        ),
                      }}
                    />
                  </div>
                  <p
                    className="text-xs text-gray-400 whitespace-nowrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        new Date(participant.createdAt).toLocaleDateString(),
                        searchTerm
                      ),
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            Aucun {titleSingular.toLowerCase()}.
          </p>
        )}
      </div>
    </Body>
  );
}
