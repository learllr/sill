import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

export default function GeneralHeaderActions({ titlePlural, onAdd, onReset }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">
        Liste des {titlePlural.toLowerCase()}
      </h1>
      <Button
        onClick={() => {
          onReset();
          onAdd();
        }}
        size="sm"
      >
        <Plus /> Ajouter
      </Button>
    </div>
  );
}
