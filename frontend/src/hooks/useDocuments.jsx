import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useDocuments = (selectedMainTab, selectedSubTab) => {
  const queryClient = useQueryClient();

  // Récupérer les documents
  const {
    data: documents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["documents", selectedMainTab, selectedSubTab],
    queryFn: async () => {
      const response = await axios.get(
        `/document/type/${encodeURIComponent(selectedMainTab)}`
      );
      return response.data.documents;
    },
    enabled: !!selectedMainTab,
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
      queryClient.invalidateQueries([
        "documents",
        selectedMainTab,
        selectedSubTab,
      ]);
    },
  });

  // Supprimer un document
  const deleteMutation = useMutation({
    mutationFn: async (documentId) => {
      await axios.delete(`/document/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        "documents",
        selectedMainTab,
        selectedSubTab,
      ]);
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
      queryClient.invalidateQueries([
        "documents",
        selectedMainTab,
        selectedSubTab,
      ]);
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
