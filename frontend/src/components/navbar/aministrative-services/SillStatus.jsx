import React, { useState } from "react";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions.jsx";
import SillStatusNavMenu from "./SillStatusNavMenu.jsx";

export default function StatutSILL() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Bilans");

  return (
    <div className="px-4 w-full">
      <DetailsHeaderActions
        title="Statut SILL"
        onEdit={() => setIsEditing(!isEditing)}
        onDelete={() => {}}
        showRemoveButton={false}
      />

      <SillStatusNavMenu
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
    </div>
  );
}
