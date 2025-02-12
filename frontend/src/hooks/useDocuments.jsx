import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useDocuments = () => {
  const queryClient = useQueryClient();

  // Récupérer tous les documents
  const {
    data: documents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await axios.get("/document");
      return response.data;
    },
  });

  // Ajouter un document
  const addMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });

  // Supprimer un document
  const deleteMutation = useMutation({
    mutationFn: async (documentId) => {
      await axios.delete(`/document/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });

  // Modifier un document
  const updateMutation = useMutation({
    mutationFn: async ({ documentId, formData }) => {
      const response = await axios.put(`/document/${documentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });

  return {
    documents,
    isLoading,
    isError,
    addMutation,
    deleteMutation,
    updateMutation,
  };
};
