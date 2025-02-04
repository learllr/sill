import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import React from "react";

export default function DetailsHeaderActions({
  title,
  navigateBack,
  onEdit,
  onDelete,
  backUrl,
  showRemoveButton = true,
}) {
  return (
    <div className="flex justify-between items-center mb-4 border-gray-300">
      <div className="flex flex-row space-x-3 items-center">
        <ArrowLeft
          className="text-xl cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() => navigateBack(backUrl)}
        />
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      <div className="flex space-x-2">
        <Button onClick={onEdit}>
          <Edit className="h-3 w-3" />
        </Button>
        {showRemoveButton && (
          <Button onClick={onDelete} variant="destructive">
            <Trash className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
