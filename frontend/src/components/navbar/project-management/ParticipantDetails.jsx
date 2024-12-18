import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Globe,
  Mail,
  MapPin,
  Phone,
  Trash,
  User,
  UserCheck,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../../src/axiosConfig.js";
import { formatPhone } from "../../../../utils/textUtils.js";
import Body from "../../common/Body";

export default function ParticipantDetails() {
  const { id, typeId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const fetchParticipantDetails = async () => {
    const response = await axios.get(`/participant/${typeId}/${id}`);
    return response.data;
  };

  const updateParticipant = useMutation(
    async (updatedParticipant) => {
      const response = await axios.put(
        `/participant/${typeId}/${id}`,
        updatedParticipant
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["participant", id, typeId]);
        setIsEditing(false);
      },
    }
  );

  const deleteParticipant = useMutation(
    async () => {
      await axios.delete(`/participant/${typeId}/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["participants", typeId]);
        navigate(`/participant/${typeId}`);
      },
    }
  );

  const {
    data: participant,
    isLoading,
    error,
  } = useQuery(["participant", id, typeId], fetchParticipantDetails);

  const { register, handleSubmit, reset } = useForm();

  if (isLoading) return <Body children={<p>Chargement des détails...</p>} />;
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des détails.</p>} />
    );

  const onSubmit = (data) => {
    updateParticipant.mutate(data);
  };

  const handleEdit = () => {
    reset(participant);
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce participant ?")) {
      deleteParticipant.mutate();
    }
  };

  return (
    <Body
      children={
        <div className="px-4 w-full">
          <div className="flex justify-between items-center mb-4 border-gray-300 pb-2">
            <div className="flex flex-row space-x-3 items-center">
              <ArrowLeft
                className="text-xl cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => navigate(`/participant/${typeId}`)}
              />
              <h1 className="text-2xl font-semibold">{participant.name}</h1>
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
              Informations
            </h1>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span>Nom</span>
                  </label>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-blue-500" />
                    <span>Interlocuteur</span>
                  </label>
                  <input
                    {...register("contactPerson")}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-amber-400" />
                    <span>Téléphone</span>
                  </label>
                  <input
                    {...register("phone")}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-red-500" />
                    <span>Email</span>
                  </label>
                  <input
                    {...register("email", {
                      pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    })}
                    type="email"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    <span>Adresse</span>
                  </label>
                  <input
                    {...register("address")}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-pink-500" />
                    <span>Site Web</span>
                  </label>
                  <input
                    {...register("website", {
                      pattern: /^(https?:\/\/)?([\w\d\-]+\.)+\w{2,}(\/.*)?$/,
                    })}
                    type="text"
                    className="py-2 px-3 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
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
                {participant.contactPerson && (
                  <li className="flex items-center text-gray-700">
                    <UserCheck className="h-5 w-5 text-blue-500 mr-3" />
                    <span>
                      <strong>Interlocuteur :</strong>{" "}
                      {participant.contactPerson}
                    </span>
                  </li>
                )}
                {participant.phone && (
                  <li className="flex items-center text-gray-700">
                    <Phone className="h-5 w-5 text-amber-400 mr-3" />
                    <span>
                      <strong>Téléphone :</strong>{" "}
                      {formatPhone(participant.phone)}
                    </span>
                  </li>
                )}
                {participant.email && (
                  <li className="flex items-center text-gray-700">
                    <Mail className="h-5 w-5 text-red-500 mr-3" />
                    <span>
                      <strong>Email :</strong> {participant.email}
                    </span>
                  </li>
                )}
                {participant.address && (
                  <li className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 text-purple-500 mr-3" />
                    <span>
                      <strong>Adresse :</strong> {participant.address}
                    </span>
                  </li>
                )}
                {participant.website && (
                  <li className="flex items-center text-gray-700">
                    <Globe className="h-5 w-5 text-pink-500 mr-3" />
                    <span>
                      <strong>Site Web :</strong>{" "}
                      <a
                        href={participant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        {participant.website}
                      </a>
                    </span>
                  </li>
                )}
                {participant.updatedAt && (
                  <li className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 text-orange-500 mr-3" />
                    <span>
                      <strong>Modifié le :</strong>{" "}
                      {new Date(participant.updatedAt).toLocaleDateString()}
                    </span>
                  </li>
                )}
                {participant.createdAt && (
                  <li className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 text-green-500 mr-3" />
                    <span>
                      <strong>Créé le :</strong>{" "}
                      {new Date(participant.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      }
    />
  );
}
