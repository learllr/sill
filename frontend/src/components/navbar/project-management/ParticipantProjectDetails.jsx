import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ParticipantNavMenu from "./ParticipantNavMenu.jsx";
import QuoteList from "./ParticipantNavMenu/QuoteList.jsx";
import InvoiceList from "./ParticipantNavMenu/InvoiceList.jsx";

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
        </div>
      </CardContent>
    </Card>
  );
}
