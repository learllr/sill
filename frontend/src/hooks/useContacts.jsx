import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useContacts = (contactType) => {
  const queryClient = useQueryClient();

  // Récupérer les contacts
  const {
    data: contacts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contacts", contactType],
    queryFn: async () => {
      const response = await axios.get(`/${contactType}`);
      return response.data;
    },
    enabled: !!contactType,
  });

  // Ajouter un contact
  const addMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(`/${contactType}`, formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts", contactType]);
    },
  });

  // Supprimer un contact
  const deleteMutation = useMutation({
    mutationFn: async (contactId) => {
      await axios.delete(`/${contactType}/${contactId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts", contactType]);
    },
  });

  // Modifier un contact
  const updateMutation = useMutation({
    mutationFn: async ({ contactId, formData }) => {
      const response = await axios.put(
        `/${contactType}/${contactId}`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts", contactType]);
    },
  });

  return {
    contacts,
    isLoading,
    isError,
    addMutation,
    deleteMutation,
    updateMutation,
  };
};
