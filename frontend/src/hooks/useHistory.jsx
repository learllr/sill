import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useHistory = () => {
  const queryClient = useQueryClient();

  // Récupérer les logs de connexion
  const {
    data: history,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loginHistory"],
    queryFn: async () => {
      const { data } = await axios.get("/authentification/history");
      return data;
    },
  });

  // Supprimer des logs de connexion
  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await axios.delete("/authentification/history", { data: { ids } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["loginHistory"]);
    },
  });

  return {
    history,
    isLoading,
    isError,
    deleteMutation,
  };
};
