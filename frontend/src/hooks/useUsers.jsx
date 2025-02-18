import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Récupérer les utilisateurs
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/user");
      return data;
    },
  });

  // Ajouter un utilisateur
  const addMutation = useMutation({
    mutationFn: async (userData) => {
      const { data } = await axios.post("/user", userData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  // Modifier un utilisateur
  const updateMutation = useMutation({
    mutationFn: async ({ id, field, value }) => {
      await axios.put(`/user/${id}`, { [field]: value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  // Supprimer un utilisateur
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/user/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  return {
    users,
    isLoading,
    isError,
    addMutation,
    updateMutation,
    deleteMutation,
  };
};
