import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";

export default function GeneralHeaderActions({
  title,
  onAdd,
  onReset,
  onSearchChange,
  searchValue,
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">
        Liste des {title.toLowerCase()}
      </h1>
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder={`Rechercher...`}
          className="w-full sm:w-96"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
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
    </div>
  );
}
