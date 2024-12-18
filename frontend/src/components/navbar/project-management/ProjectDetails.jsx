import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import ParticipantSelectorDialog from "../../dialogs/SelectorDialog.jsx";

export default function ProjectDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [currentSelector, setCurrentSelector] = useState(null);
  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    const response = await axios.get(`/project/${id}`);
    return response.data;
  };

  const updateProjectParticipants = async (participant) => {
    const updatedParticipants = [
      ...(currentSelector === "client"
        ? project.client
          ? []
          : []
        : project[currentSelector] || []
      ).map((p) => p.id),
      participant.id,
    ];

    await axios.put(`/project/${id}/participants`, {
      participantIds: updatedParticipants,
      type:
        currentSelector === "client"
          ? 3
          : currentSelector === "suppliers"
          ? 1
          : currentSelector === "subcontractors"
          ? 2
          : 4,
    });

    queryClient.invalidateQueries(["project", id]);
    setCurrentSelector(null);
  };

  const {
    data: project,
    isLoading,
    error,
  } = useQuery(["project", id], fetchProjectDetails);

  const handleSelectParticipant = (participant) => {
    const alreadyExists = project[currentSelector]?.some(
      (item) => item.id === participant.id
    );

    if (alreadyExists) {
      alert(`${participant.name} est déjà ajouté.`);
      return;
    }

    updateProjectParticipants(participant);
  };

  if (isLoading) return <Body children={<p>Chargement du chantier...</p>} />;
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération du chantier.</p>} />
    );

  return (
    <Body
      children={
        <div className="px-4 w-full">
          <div className="flex flex-row space-x-3 items-center">
            <ArrowLeft
              className="text-xl cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => navigate("/projects")}
            />
            <h1 className="text-2xl font-semibold">{project.name}</h1>
          </div>
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Client</h3>
              <ul>
                {project.client?.length > 0 ? (
                  <li key={project.client[0]?.id}>
                    <p>Nom: {project.client[0]?.name}</p>
                    <p>Contact: {project.client[0]?.contactPerson}</p>
                    <p>Email: {project.client[0]?.email}</p>
                  </li>
                ) : (
                  <p>Aucun client ajouté.</p>
                )}
              </ul>
              <Button
                onClick={() => setCurrentSelector("client")}
                className="mt-2"
              >
                {project.client?.length > 0
                  ? "Modifier le client"
                  : "Ajouter un client"}
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Fournisseurs</h3>
              <ul>
                {project.suppliers?.length > 0 ? (
                  project.suppliers.map((supplier) => (
                    <li key={supplier.id}>
                      <p>Nom: {supplier.name}</p>
                      <p>Contact: {supplier.contactPerson}</p>
                      <p>Email: {supplier.email}</p>
                    </li>
                  ))
                ) : (
                  <p>Aucun fournisseur ajouté.</p>
                )}
              </ul>
              <Button
                onClick={() => setCurrentSelector("suppliers")}
                className="mt-2"
              >
                Ajouter un fournisseur
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Sous-traitants</h3>
              <ul>
                {project.subcontractors?.length > 0 ? (
                  project.subcontractors.map((subcontractor) => (
                    <li key={subcontractor.id}>
                      <p>Nom: {subcontractor.name}</p>
                      <p>Contact: {subcontractor.contactPerson}</p>
                      <p>Email: {subcontractor.email}</p>
                    </li>
                  ))
                ) : (
                  <p>Aucun sous-traitant ajouté.</p>
                )}
              </ul>
              <Button
                onClick={() => setCurrentSelector("subcontractors")}
                className="mt-2"
              >
                Ajouter un sous-traitant
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold">Architectes</h3>
              <ul>
                {project.architects?.length > 0 ? (
                  project.architects.map((architect) => (
                    <li key={architect.id}>
                      <p>Nom: {architect.name}</p>
                      <p>Contact: {architect.contactPerson}</p>
                      <p>Email: {architect.email}</p>
                    </li>
                  ))
                ) : (
                  <p>Aucun architecte ajouté.</p>
                )}
              </ul>
              <Button
                onClick={() => setCurrentSelector("architects")}
                className="mt-2"
              >
                Ajouter un architecte
              </Button>
            </div>
          </div>

          {currentSelector && (
            <ParticipantSelectorDialog
              type="participants"
              typeId={
                currentSelector === "client"
                  ? 3
                  : currentSelector === "suppliers"
                  ? 1
                  : currentSelector === "subcontractors"
                  ? 2
                  : 4
              }
              onSelect={handleSelectParticipant}
              onClose={() => setCurrentSelector(null)}
            />
          )}
        </div>
      }
    />
  );
}
