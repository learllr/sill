import { Plus } from "lucide-react";
import { useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import NavigationSubTabs from "../../Design/Buttons/NavigationSubTabs.jsx";
import ScrollBarSearch from "../ScrollBarSearch.jsx";
import ContactCard from "./ContactCard.jsx";

export default function ItemContainer({
  items,
  subMenuItems,
  selectedSubTab,
  setSelectedSubTab,
  onAdd,
  onSelectItem,
  contactType,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBySubTab = items.filter((contact) => {
    if (selectedSubTab === "Actifs") return contact.active;
    if (selectedSubTab === "Inactifs") return !contact.active;
    return true;
  });

  const filteredItems = filteredBySubTab.filter((contact) => {
    if (!searchTerm) return true;
    const firstName = contact.firstName?.toLowerCase() || "";
    const lastName = contact.lastName?.toLowerCase() || "";
    return (
      firstName.includes(searchTerm.toLowerCase()) ||
      lastName.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="border p-4 flex flex-col space-y-3 h-[80vh]">
      <div className="flex justify-between items-center space-x-2">
        <ScrollBarSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <IconButton onClick={onAdd} variant="green">
          <Plus />
        </IconButton>
      </div>

      {subMenuItems.length > 0 && (
        <NavigationSubTabs
          subMenuItems={subMenuItems}
          selectedSubTab={selectedSubTab}
          setSelectedSubTab={setSelectedSubTab}
        />
      )}

      <div className="space-y-4 p-2 overflow-auto">
        {filteredItems.length > 0 ? (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, max-content))",
            }}
          >
            {filteredItems.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onSelectItem={onSelectItem}
                contactType={contactType}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Aucun contact trouvé</p>
        )}
      </div>
    </div>
  );
}
