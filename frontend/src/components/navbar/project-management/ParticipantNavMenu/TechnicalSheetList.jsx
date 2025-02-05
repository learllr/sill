import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import axios from "../../../../axiosConfig.js";
import EditableContentManager from "../../../common/Files/EditableContentManager.jsx";

export default function TechnicalSheetList({ participant }) {
  const { id, projectId } = participant.ProjectParticipant;
  const [technicalSheets, setTechnicalSheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchTechnicalSheets = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(`/document/${projectId}/2/${id}`);
      return data;
    },
    onSuccess: (data) => {
      setTechnicalSheets(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error(
        "Erreur lors de la récupération des fiches techniques :",
        error
      );
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchTechnicalSheets.mutate();
  }, [id, projectId]);

  return (
    <div className="mt-4">
      {isLoading ? (
        <p className="p-4">Chargement des fiches techniques...</p>
      ) : technicalSheets.length > 0 ? (
        <ul className="p-4 space-y-4">
          {technicalSheets.map((sheet) => (
            <li key={sheet.id} className="border-b py-2">
              <p className="font-medium">{sheet.title}</p>
            </li>
          ))}
        </ul>
      ) : (
        <EditableContentManager
          documentTypeId={16}
          allowMultiple={false}
          showRemoveButton={false}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
}
