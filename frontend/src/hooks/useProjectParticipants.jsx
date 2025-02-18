import { useQuery } from "react-query";
import axios from "../axiosConfig.js";

export const useProjectParticipants = (projectId) => {
  const { data: participants = [], isLoading } = useQuery(
    ["projectParticipants", projectId],
    async () => {
      if (!projectId) return [];
      const response = await axios.get(`/project/${projectId}/participants`);
      return response.data;
    },
    { enabled: !!projectId }
  );

  return { participants, isLoading };
};
