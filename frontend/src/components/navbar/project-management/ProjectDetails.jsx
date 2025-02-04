import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
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
import { Trash } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [currentSelector, setCurrentSelector] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  if (!project)
    return (
      <Body children={<p className="text-sm">Chargement du chantier...</p>} />
    );

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title={project.name}
          navigateBack={navigate}
          backUrl="/chantiers"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded m-4">{error}</div>
        )}

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
              <div key={section} className="m-4 border p-3">
                <h3 className="font-semibold mb-3">
                  {participants.length > 1 ? `${sectionName}s` : sectionName}
                </h3>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="flex w-full">
                      <TableHead className="flex-1 text-center text-gray-800">
                        Nom
                      </TableHead>
                      <TableHead className="flex-1 text-center text-gray-800">
                        Interlocuteur
                      </TableHead>
                      {isEditing && (
                        <TableHead className="w-1/6 text-center text-gray-800">
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.length > 0 ? (
                      participants.map((participant) => (
                        <TableRow
                          key={participant.id}
                          className="flex w-full border-b"
                        >
                          <TableCell className="flex-1 text-center text-gray-500 truncate">
                            <Link
                              to={`/${getTypeName(
                                section === "subcontractors"
                                  ? 3
                                  : section === "suppliers"
                                  ? 2
                                  : section === "clients"
                                  ? 1
                                  : 4,
                                false
                              )}/${participant.id}`}
                              className="block w-full h-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {participant.name}
                            </Link>
                          </TableCell>
                          <TableCell className="flex-1 text-center text-gray-500 truncate">
                            <Link
                              to={`/${section}/${participant.id}`}
                              className="block w-full h-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {participant.contactPerson}
                            </Link>
                          </TableCell>

                          {isEditing && (
                            <TableCell className="w-1/6 text-center">
                              <button
                                onClick={() =>
                                  removeParticipantFromProject(participant)
                                }
                                className="text-red-600 bg-red-100 p-1 rounded-full"
                              >
                                <Trash className="h-3 w-3 " />
                              </button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="flex w-full">
                        <TableCell
                          colSpan={isEditing ? 4 : 3}
                          className="text-center text-gray-500 flex-1"
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
                    className="mt-2"
                  >
                    Ajouter un {sectionName.toLowerCase()}
                  </Button>
                )}
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
