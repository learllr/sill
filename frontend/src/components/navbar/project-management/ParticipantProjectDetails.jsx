import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ParticipantNavMenu from "./ParticipantNavMenu.jsx";
import QuoteList from "./ParticipantNavMenu/QuoteList.jsx";
import InvoiceList from "./ParticipantNavMenu/InvoiceList.jsx";
import TechnicalSheetList from "./ParticipantNavMenu/TechnicalSheetList.jsx";

export default function ParticipantProjectDetails({ participant }) {
  const [activeTab, setActiveTab] = useState("Devis");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Détails de {participant.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ParticipantNavMenu
          participantType={participant.type}
          onTabChange={setActiveTab}
        />

        <div className="mt-4">
          {activeTab === "Devis" && <QuoteList participant={participant} />}
          {activeTab === "Factures" && (
            <InvoiceList participant={participant} />
          )}
          {activeTab === "Fiches techniques" && (
            <TechnicalSheetList participant={participant} />
          )}
          {activeTab !== "Devis" &&
            activeTab !== "Factures" &&
            activeTab !== "Fiches techniques" && (
              <p className="p-4">
                Données pour "{activeTab}" non implémentées.
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
