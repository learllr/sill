import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../../src/axiosConfig.js";
import { getTypeName } from "../../../../utils/typeUtils.js";
import Body from "../../common/Body";
import DetailsDisplay from "../../common/Pages/DetailsDisplay";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions";
import DynamicForm from "../../common/Pages/DynamicForm";

export default function ParticipantDetails({ typeId, typeName }) {
  const { id } = useParams();
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
        navigate(`/${typeName}s`);
      },
    }
  );

  const {
    data: participant,
    isLoading,
    error,
  } = useQuery(["participant", id, typeId], fetchParticipantDetails);

  const {
    register,
    reset,
    formState: { errors },
  } = useForm();

  if (isLoading)
    return (
      <Body children={<p className="text-sm">Chargement des détails...</p>} />
    );
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des détails.</p>} />
    );

  const handleEdit = () => {
    reset(participant);
    setIsEditing(true);
  };

  const article = ["a", "e", "i", "o", "u", "é"].includes(
    getTypeName(typeId, false)[0].toLowerCase()
  )
    ? "cet"
    : "ce";

  const handleDelete = () => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer ${article} ${getTypeName(
          typeId,
          false
        ).toLowerCase()} ?`
      )
    ) {
      deleteParticipant.mutate();
    }
  };

  const fields = [
    {
      section: "Informations générales",
      items: [
        {
          label: "Nom",
          name: "name",
          type: "text",
          required: true,
          value: participant?.name,
        },
        {
          label: "Interlocuteur",
          name: "contactPerson",
          type: "text",
          value: participant?.contactPerson,
        },
        {
          label: "Téléphone",
          name: "phone",
          type: "text",
          value: participant?.phone,
          isPhone: true,
        },
        {
          label: "Email",
          name: "email",
          type: "email",
          value: participant?.email,
        },
        {
          label: "Adresse",
          name: "address",
          type: "text",
          value: participant?.address,
        },
        {
          label: "Site Web",
          name: "website",
          type: "text",
          value: participant?.website,
          link: participant?.website,
          isExternal: true,
        },
      ],
    },
  ];

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title={participant?.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="p-4 border border-gray-300 bg-white">
          {isEditing ? (
            <DynamicForm
              fields={fields}
              register={register}
              errors={errors}
              onSubmit={(data) => {
                updateParticipant.mutate(data);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <DetailsDisplay data={fields} />
          )}
        </div>
      </div>
    </Body>
  );
}
