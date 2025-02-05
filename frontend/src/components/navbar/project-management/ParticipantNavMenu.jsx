import NavigationTabs from "../../common/Buttons/NavigationTabs.jsx";

const menuItems = {
  Fournisseur: ["Devis", "Factures", "Fiches techniques", "Bons pour accord"],
  Client: ["Devis", "Factures", "Devis validés"],
  "Sous-traitant": ["Administratif", "Contrats", "Factures"],
  Architecte: [
    "Plans",
    "Bons de commandes",
    "PV",
    "Ordres de règlement",
    "Réserves",
    "Marchés",
    "DOE",
  ],
};

export default function ParticipantNavMenu({ participantType, onTabChange }) {
  const items = menuItems[participantType] || [];
  return <NavigationTabs items={items} onTabChange={onTabChange} />;
}
