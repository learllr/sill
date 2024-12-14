import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getTypeName } from "../../../../utils/typeUtils.js";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";

export default function Participants() {
  const navigate = useNavigate();
  const { typeId } = useParams();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  return (
    <Body
      children={
        <div className="px-4 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-700">
              Liste des {titlePlural.toLowerCase()}
            </h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => reset()}>
                  <Plus className="mr-1 h-4 w-4" /> Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Ajouter un {titleSingular.toLowerCase()}
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez le formulaire ci-dessous pour ajouter un{" "}
                    {titleSingular.toLowerCase()} à la liste.
                  </DialogDescription>
                  <Separator />
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <Input
                      {...register("name", { required: "Nom requis" })}
                      placeholder={`Nom du ${titleSingular.toLowerCase()}`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
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
                    <Input
                      {...register("phone")}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      {...register("email", {
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                      Site Web
                    </label>
                    <Input {...register("website")} placeholder="Site Web" />
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">Ajouter</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? (
            <p>Chargement des {titlePlural.toLowerCase()}...</p>
          ) : error ? (
            <p className="text-red-500">
              Erreur lors de la récupération des {titlePlural.toLowerCase()}.
            </p>
          ) : (
            <ul>
              {participants.map((participant) => (
                <li key={participant.id} className="mb-4">
                  <button
                    onClick={() =>
                      navigate(`/participant/${typeId}/${participant.id}`)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                  >
                    <div className="flex flex-col items-start">
                      <p className="leading-tight">{participant.name}</p>
                    </div>
                    <p className="text-sm text-gray-400 whitespace-nowrap">
                      {new Date(participant.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      }
    />
  );
}
