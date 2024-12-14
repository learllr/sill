import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import ParticipantSelectorDialog from "../../dialogs/ParticipantSelectorDialog.jsx";

export default function ProjectDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedParticipants, setSelectedParticipants] = useState({
    suppliers: [],
    subcontractors: [],
    architects: [],
  });
  const [currentSelector, setCurrentSelector] = useState(null);

  const fetchProjectDetails = async () => {
    const response = await axios.get(`/project/${id}`);
    return response.data;
  };

  const {
    data: project,
    isLoading,
    error,
  } = useQuery(["project", id], fetchProjectDetails);

  const handleSelectParticipant = (participant) => {
    setSelectedParticipants((prev) => {
      const currentList = prev[currentSelector];
      const alreadyExists = currentList.some(
        (item) => item.id === participant.id
      );

      if (alreadyExists) {
        alert(`${participant.name} est déjà ajouté.`);
        return prev;
      }

      return {
        ...prev,
        [currentSelector]: [...currentList, participant],
      };
    });
    setCurrentSelector(null);
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
          <h1 className="text-2xl font-semibold text-gray-700 mb-6">
            {project.name}
          </h1>
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Fournisseurs</h3>
              <ul>
                {selectedParticipants.suppliers.map((supplier) => (
                  <li key={supplier.id}>{supplier.name}</li>
                ))}
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
                {selectedParticipants.subcontractors.map((subcontractor) => (
                  <li key={subcontractor.id}>{subcontractor.name}</li>
                ))}
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
                {selectedParticipants.architects.map((architect) => (
                  <li key={architect.id}>{architect.name}</li>
                ))}
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
              typeId={
                currentSelector === "suppliers"
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
