import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "../../../../src/axiosConfig.js";
import Body from "../../common/Body";

export default function Projects() {
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const response = await axios.get("/project");
    return response.data;
  };

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery("projects", fetchProjects);

  if (isLoading) return <Body children={<p>Chargement des chantiers...</p>} />;
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des chantiers.</p>} />
    );

  return (
    <Body
      children={
        <div className="flex justify-center items-center">
          <div className="px-4 w-full">
            <h1 className="text-2xl font-semibold mb-6">Liste des chantiers</h1>
            {projects.length > 0 ? (
              <ul>
                {projects.map((project) => (
                  <li key={project.id} className="mb-2">
                    <button
                      onClick={() => navigate(`/project/${project.id}`)}
                      className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                      <div className="text-sm flex flex-col items-start">
                        <p className="leading-tight">{project.name}</p>
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">Aucun chantier.</p>
            )}
          </div>
        </div>
      }
    />
  );
}
