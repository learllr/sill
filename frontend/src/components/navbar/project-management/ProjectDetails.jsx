import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import ParticipantSelectorDialog from "../../dialogs/SelectorDialog.jsx";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [currentSelector, setCurrentSelector] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`/project/${id}`);
      setProject(response.data);
      setError(null);
    } catch (error) {
      console.error("Erreur lors de la récupération du projet :", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const addParticipantToProject = async (participant, typeId) => {
    try {
      const section =
        typeId === 1
          ? "clients"
          : typeId === 2
          ? "suppliers"
          : typeId === 3
          ? "subcontractors"
          : "architects";

      const existingParticipants = project[section] || [];
      if (existingParticipants.some((p) => p.id === participant.id)) {
        setError(`${participant.name} a déjà été ajouté.`);
        return;
      }

      await axios.post(`/project/${id}/participants`, {
        participantId: participant.id,
        typeId,
      });
      await fetchProjectDetails();
    } catch (error) {
      console.error("Erreur lors de l'ajout du participant :", error);
    }
  };

  const removeParticipantFromProject = async (participant) => {
    try {
      await axios.delete(`/project/${id}/participants/${participant.id}`);
      await fetchProjectDetails();
    } catch (error) {
      console.error("Erreur lors de la suppression du participant :", error);
    }
  };

  const handleSelectParticipant = async (participant) => {
    const typeId =
      currentSelector === "clients"
        ? 1
        : currentSelector === "suppliers"
        ? 2
        : currentSelector === "subcontractors"
        ? 3
        : 4;
    await addParticipantToProject(participant, typeId);
    setCurrentSelector(null);
  };

  const handleEdit = () => {
    navigate(`/project/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/project/${id}`);
      navigate("/projects");
    } catch (error) {
      console.error("Erreur lors de la suppression du projet :", error);
    }
  };

  if (!project) return <Body children={<p>Chargement du chantier...</p>} />;

  return (
    <Body>
      <div className="px-4 w-full">
        <div className="flex justify-between items-center mb-4 border-gray-300 pb-2">
          <div className="flex flex-row space-x-3 items-center">
            <ArrowLeft
              className="text-xl cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => navigate("/projects")}
            />
            <h1 className="text-2xl font-semibold">{project.name}</h1>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded m-4">
              {error}
            </div>
          )}

          <div className="flex space-x-4 mt-4">
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              <Trash className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>

        {["clients", "suppliers", "subcontractors", "architects"].map(
          (section) => {
            const sectionName =
              section === "clients"
                ? "Client"
                : section === "suppliers"
                ? "Fournisseur"
                : section === "subcontractors"
                ? "Sous-traitant"
                : "Architecte";

            const participants = project[section] || [];

            return (
              <div key={section} className="m-4">
                <h3 className="text-lg font-semibold">
                  {section === "clients" ? sectionName : `${sectionName}(s)`}
                </h3>
                <ul>
                  {participants.length > 0 ? (
                    participants.map((participant) => (
                      <li
                        key={participant.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p>Nom: {participant.name}</p>
                          <p>Contact: {participant.contactPerson}</p>
                          <p>Email: {participant.email}</p>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            removeParticipantFromProject(participant)
                          }
                          className="ml-4"
                        >
                          Supprimer
                        </Button>
                      </li>
                    ))
                  ) : (
                    <p>Aucun {sectionName.toLowerCase()} ajouté.</p>
                  )}
                </ul>
                {section !== "clients" || participants.length === 0 ? (
                  <Button
                    onClick={() => setCurrentSelector(section)}
                    className="mt-2"
                  >
                    Ajouter un {sectionName.toLowerCase()}
                  </Button>
                ) : null}
              </div>
            );
          }
        )}
        {currentSelector && (
          <ParticipantSelectorDialog
            type="participants"
            typeId={
              currentSelector === "clients"
                ? 1
                : currentSelector === "suppliers"
                ? 2
                : currentSelector === "subcontractors"
                ? 3
                : 4
            }
            onSelect={handleSelectParticipant}
            onClose={() => setCurrentSelector(null)}
          />
        )}
      </div>
    </Body>
  );
}
