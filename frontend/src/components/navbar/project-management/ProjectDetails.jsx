import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions.jsx";
import ParticipantSelectorDialog from "../../dialogs/SelectorDialog.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTypeName } from "../../../../utils/typeUtils.js";
import { Trash, FileText } from "lucide-react";
import ParticipantProjectDetails from "./ParticipantProjectDetails.jsx";
import { useMutation } from "react-query";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [currentSelector, setCurrentSelector] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedParticipantType, setSelectedParticipantType] = useState(null);
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

  const removeParticipantFromProject = async (participant) => {
    try {
      await axios.delete(`/project/${id}/participants/${participant.id}`);
      await fetchProjectDetails();
      setSelectedParticipant(null);
      setSelectedParticipantType(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du participant :", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const deleteProject = useMutation(
    async () => {
      await axios.delete(`/project/${id}`);
    },
    {
      onSuccess: () => {
        navigate("/chantiers");
      },
    }
  );

  const handleDelete = async () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce chantier ?")) {
      deleteProject.mutate();
    }
  };

  const handleAddParticipant = async (selected) => {
    try {
      await axios.post(`/project/${id}/participants`, {
        participantId: selected.id,
      });
      await fetchProjectDetails();
      setCurrentSelector(null);
    } catch (error) {
      console.error("Erreur lors de l'ajout du participant :", error);
    }
  };

  if (!project)
    return (
      <Body children={<p className="text-sm">Chargement du chantier...</p>} />
    );

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title={project.name}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded m-4">{error}</div>
        )}

        <div className="flex flex-row space-x-2">
          <div className="w-1/3 flex flex-col space-y-2">
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
                  <div key={section} className="border p-3">
                    <h3 className="font-semibold mb-3">
                      {participants.length > 1
                        ? `${sectionName}s`
                        : sectionName}
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/2 text-center text-gray-800">
                            Nom
                          </TableHead>
                          <TableHead className="w-1/2 text-center text-gray-800">
                            {isEditing ? "Supprimer" : "Voir"}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.length > 0 ? (
                          participants.map((participant) => (
                            <TableRow
                              key={participant.id}
                              className="w-full border-b cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setSelectedParticipant(participant);
                                setSelectedParticipantType(sectionName);
                              }}
                            >
                              <TableCell className="w-1/2 text-center text-gray-500 truncate">
                                {participant.name}
                              </TableCell>
                              <TableCell className="w-1/2 text-center">
                                {isEditing ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeParticipantFromProject(participant);
                                    }}
                                    className="text-red-600 bg-red-100 p-1 rounded-full"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/${getTypeName(
                                          section === "subcontractors"
                                            ? 3
                                            : section === "suppliers"
                                            ? 2
                                            : section === "clients"
                                            ? 1
                                            : 4,
                                          false
                                        )}/${participant.id}`
                                      );
                                    }}
                                    className="text-blue-600 bg-blue-100 p-1 rounded-full"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="text-center text-gray-500 w-full"
                            >
                              Aucun {sectionName.toLowerCase()} ajouté.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {isEditing && (
                      <Button
                        onClick={() => setCurrentSelector(section)}
                        className="mt-2 w-full"
                      >
                        Ajouter un {sectionName.toLowerCase()}
                      </Button>
                    )}
                  </div>
                );
              }
            )}
          </div>

          <div className="w-2/3">
            {selectedParticipant && (
              <ParticipantProjectDetails
                participant={{
                  ...selectedParticipant,
                  type: selectedParticipantType,
                }}
              />
            )}
          </div>
        </div>

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
            onSelect={handleAddParticipant}
            onClose={() => setCurrentSelector(null)}
          />
        )}
      </div>
    </Body>
  );
}
