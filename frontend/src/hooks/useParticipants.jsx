import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useParticipants = (enabled = true) => {
  const queryClient = useQueryClient();

  // Récupérer les participants
  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery(
      ["participants"],
      async () => {
        const response = await axios.get("/participant");
        return response.data;
      },
      { enabled: !!enabled }
    );

  // Ajouter un participant
  const addParticipant = useMutation({
    mutationFn: async (participantData) => {
      const response = await axios.post("/participant", participantData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["participants"]);
    },
  });

  // Modifier un participant
  const updateParticipant = useMutation({
    mutationFn: async ({ participantId, updatedData }) => {
      const response = await axios.put(
        `/participant/${participantId}`,
        updatedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["participants"]);
    },
  });

  // Supprimer un participant
  const deleteParticipant = useMutation({
    mutationFn: async (participantId) => {
      await axios.delete(`/participant/${participantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["participants"]);
    },
  });

  return {
    participants,
    isLoadingParticipants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
  };
};
