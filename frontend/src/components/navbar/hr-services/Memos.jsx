import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Body from "../../common/Body.jsx";
import EditableContentManager from "../../common/Files/EditableContentManager.jsx";
import SelectorDialog from "../../dialogs/SelectorDialog.jsx";

export default function Memos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(false);
    console.log("Employé sélectionné :", employee);
  };

  return (
    <Body>
      <div className="px-4 w-full">
        <h1 className="text-2xl font-semibold mb-6">Notes de services</h1>
        <EditableContentManager documentTypeId={15} allowMultiple={true} />

        <div className="mt-4">
          {selectedEmployee ? (
            <p>
              Employé associé :{" "}
              <strong>
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </strong>
            </p>
          ) : (
            <p className="text-gray-600">Aucun salarié associé.</p>
          )}
        </div>

        <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
          Associer un salarié
        </Button>

        {isDialogOpen && (
          <SelectorDialog
            type="employees"
            onSelect={handleSelectEmployee}
            onClose={() => setIsDialogOpen(false)}
          />
        )}
      </div>
    </Body>
  );
}
