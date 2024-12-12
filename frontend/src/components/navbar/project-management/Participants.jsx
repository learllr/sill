import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import { Plus, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export default function Participants() {
  const navigate = useNavigate();
  const { typeId } = useParams();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  if (isLoading)
    return <Body children={<p>Chargement des participants...</p>} />;
  if (error)
    return (
      <Body
        children={<p>Erreur lors de la récupération des participants.</p>}
      />
    );

  return (
    <Body
      children={
        <div className="px-4 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-700">
              Liste des participants
            </h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => reset()}
                  className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 flex items-center text-sm rounded-md"
                >
                  <Plus className="mr-1 h-4 w-4" /> Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un participant</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <Input
                      {...register("name", { required: "Nom requis" })}
                      placeholder="Nom du participant"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Interlocuteur
                    </label>
                    <Input
                      {...register("contactPerson")}
                      placeholder="Interlocuteur principal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <Input
                      {...register("phone")}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
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
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-blue-500 text-white">
                      Ajouter
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
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
        </div>
      }
    />
  );
}
