import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useContacts = (contactType) => {
  const queryClient = useQueryClient();

  const isEmployee = contactType === "employee";

  // Récupérer les contacts
  const {
    data: contacts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contacts", contactType],
    queryFn: async () => {
      const response = await axios.get(
        isEmployee ? "/employee" : `/participant/${contactType}`
      );
      return response.data;
    },
    enabled: !!contactType,
  });

  // Ajouter un contact
  const addMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        isEmployee ? "/employee" : "/participant",
        { ...formData, type: contactType }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts", contactType]);
    },
  });

  // Supprimer un contact
  const deleteMutation = useMutation({
    mutationFn: async (contactId) => {
      const endpoint = isEmployee
        ? `/employee/${contactId}`
        : `/participant/${contactId}`;
      await axios.delete(endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts", contactType]);
    },
  });

  // Modifier un contact
  const updateMutation = useMutation({
    mutationFn: async ({ contactId, formData }) => {
      const endpoint = isEmployee
        ? `/employee/${contactId}`
        : `/participant/${contactType}/${contactId}`;
      const response = await axios.put(endpoint, formData);
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
