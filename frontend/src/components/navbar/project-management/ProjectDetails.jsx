import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "../../../../src/axiosConfig.js";
import Body from "../../common/Body";

export default function ProjectDetails() {
  const { id } = useParams();

  const fetchProjectDetails = async () => {
    const response = await axios.get(`/project/${id}`);
    return response.data;
  };

  const {
    data: project,
    isLoading,
    error,
  } = useQuery(["project", id], fetchProjectDetails);

  if (isLoading) return <Body children={<p>Chargement du projet...</p>} />;
  if (error)
    return <Body children={<p>Erreur lors de la récupération du projet.</p>} />;

  return (
    <Body
      children={
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-gray-700">
            {project.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Détails : {project.details || "Aucun détail disponible."}
          </p>
        </div>
      }
    />
  );
}
