import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "../../../../src/axiosConfig.js";
import Body from "../../common/Body.jsx";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";
import ScrollableDialog from "../../common/Pages/ScrollableDialog.jsx";

export default function Projects() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchProjects = async () => {
    const response = await axios.get("/project", {
      params: filter ? { status: filter } : {},
    });
    return response.data;
  };

  const createProject = useMutation(
    async (newProject) => {
      const response = await axios.post("/project", newProject);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("projects");
        setIsDialogOpen(false);
      },
    }
  );

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery(["projects", filter], fetchProjects);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createProject.mutate(data);
  };

  if (isLoading) return <Body children={<p>Chargement des chantiers...</p>} />;
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des chantiers.</p>} />
    );

  return (
    <Body>
      <div className="px-4 w-full">
        <GeneralHeaderActions
          title="Chantiers"
          onAdd={() => setIsDialogOpen(true)}
          onReset={reset}
        />

        <ScrollableDialog
          isOpen={isDialogOpen}
          onClose={setIsDialogOpen}
          title="Ajouter un chantier"
          description="Remplissez le formulaire ci-dessous pour ajouter un chantier à la liste."
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <Input
              {...register("name", { required: "Nom requis" })}
              placeholder="Nom du chantier"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              {...register("status", { required: "Statut requis" })}
              className="border rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="Non commencé">Non commencé</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </ScrollableDialog>

        <div className="flex flex-row justify-center items-center mb-4 space-x-2">
          <label className="block text-sm font-medium mb-1">
            Filtrer par statut :
          </label>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            <option value="Non commencé">Non commencé</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>

        {projects.length > 0 ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id} className="mb-2">
                <button
                  onClick={() => navigate(`/chantier/${project.id}`)}
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
    </Body>
  );
}
