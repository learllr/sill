import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useDocuments = (selectedMainTab) => {
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading: isLoading,
    isError: isError,
  } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await axios.get("/document");
      return response.data;
    },
  });

  const {
    data: sendings,
    isLoading: isLoadingSendings,
    isError: isErrorSendings,
  } = useQuery({
    queryKey: ["sendings"],
    queryFn: async () => {
      const response = await axios.get("/document/sendings");
      return response.data;
    },
    enabled: selectedMainTab === "Les envois",
  });

  const addDocument = useMutation({
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

  const deleteDocument = useMutation({
    mutationFn: async (documentId) => {
      await axios.delete(`/document/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["documents"]);
    },
  });

  const updateDocument = useMutation({
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

  const deleteSending = useMutation({
    mutationFn: async (sendingId) => {
      await axios.delete(`/document/sendings/${sendingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sendings"]);
    },
  });

  return {
    documents,
    isLoading,
    isError,
    sendings,
    isLoadingSendings,
    isErrorSendings,
    addDocument,
    deleteDocument,
    updateDocument,
    deleteSending,
  };
};
