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
import { highlightText } from "../../../../shared/utils/textUtils.js";
import { getTypeName } from "../../../../shared/constants/types.js";
import axios from "../../axiosConfig.js";

export default function SelectorDialog({ type, typeId, onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUrl =
    type === "participants" ? `/participant/${typeId}` : "/employee";

  const fetchData = async () => {
    const response = await axios.get(fetchUrl);
    return response.data;
  };

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery([type, typeId], fetchData);

  const filteredItems = searchTerm
    ? items.filter((item) => {
        if (type === "employees") {
          return (
            item.firstName &&
            item.lastName &&
            `${item.firstName} ${item.lastName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
        }

        return (
          item.name &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : items;

  const title = getTypeName(
    type === "participants" ? typeId : "employees",
    false
  ).toLowerCase();
  const titlePlural = getTypeName(
    type === "participants" ? typeId : "employees",
    true
  ).toLowerCase();

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
          <p className="text-center py-4 text-gray-600 text-sm">
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
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => onSelect(item)}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(
                            type === "employees"
                              ? `${item.firstName} ${item.lastName}`
                              : item.name,
                            searchTerm
                          ),
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
          <Button onClick={onClose} variant="destructive">
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
