import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { highlightText } from "../../../utils/textUtils.js";
import { getTypeName } from "../../../utils/typeUtils.js";
import axios from "../../axiosConfig.js";

export default function ParticipantSelectorDialog({
  typeId,
  onSelect,
  onClose,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const fetchParticipants = async () => {
    const response = await axios.get(`/participant/${typeId}`);
    return response.data;
  };

  const {
    data: participants = [],
    isLoading,
    error,
  } = useQuery(["participants", typeId], fetchParticipants);

  const filteredParticipants = participants.filter((participant) =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const title = getTypeName(typeId, false).toLowerCase();
  const titlePlural = getTypeName(typeId, true).toLowerCase();

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Sélectionner un {title}</DialogTitle>
          <DialogDescription>
            Recherchez et sélectionnez un {title} dans la liste ci-dessous. Vous
            pouvez également filtrer les résultats en saisissant un terme de
            recherche.
          </DialogDescription>
          <Separator className="my-4 border-gray-300" />
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-4 text-gray-600">
            Chargement des {titlePlural}...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 py-4">
            Erreur lors de la récupération des {titlePlural}.
          </p>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <Input
                type="text"
                placeholder={`Rechercher un ${title}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <ScrollArea className="h-60">
              <ul className="border rounded p-2">
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <li
                      key={participant.id}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => onSelect(participant)}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(participant.name, searchTerm),
                        }}
                      />
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-600">Aucun {title} trouvé.</li>
                )}
              </ul>
            </ScrollArea>
          </>
        )}

        <DialogFooter>
          <Button
            onClick={onClose}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
