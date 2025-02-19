import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../axiosConfig.js";

export const useProjects = (selectedSubTab = "Tous", projectId = null) => {
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    isError,
  } = useQuery(["projects", projectId || selectedSubTab], async () => {
    const params = projectId
      ? {}
      : selectedSubTab === "Tous"
      ? {}
      : { participantType: selectedSubTab };
    const response = await axios.get("/project", { params });
    return response.data;
  });

  const addProject = useMutation({
    mutationFn: async (projectData) => {
      const response = await axios.post("/project", projectData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({ projectId, updatedData }) => {
      const response = await axios.put(`/project/${projectId}`, updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId) => {
      await axios.delete(`/project/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const addParticipantProject = useMutation({
    mutationFn: async ({ projectId, participantId, type }) => {
      const response = await axios.post(`/project/${projectId}/participants`, {
        participantId,
        type,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const deleteParticipantProject = useMutation({
    mutationFn: async ({ projectId, participantId }) => {
      await axios.delete(`/project/${projectId}/participants/${participantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  return {
    projects,
    isLoadingProjects,
    isError,
    addProject,
    updateProject,
    deleteProject,
    addParticipantProject,
    deleteParticipantProject,
  };
};
