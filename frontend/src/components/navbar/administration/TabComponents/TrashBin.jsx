import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TrashBin() {
  const [deletedItems, setDeletedItems] = useState([
    { id: 1, name: "Devis 001" },
    { id: 2, name: "Bon de commande 123" },
    { id: 3, name: "Projet Maison Dupont" },
  ]);

  const handlePermanentDelete = (id) => {
    setDeletedItems(deletedItems.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Corbeille</h2>
      {deletedItems.length === 0 ? (
        <p>Aucun élément dans la corbeille.</p>
      ) : (
        <ul className="space-y-2">
          {deletedItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between p-2 border rounded"
            >
              <span>{item.name}</span>
              <Button
                variant="destructive"
                onClick={() => handlePermanentDelete(item.id)}
              >
                Supprimer définitivement
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
