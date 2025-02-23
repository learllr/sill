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
  isTrash,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const isEmployee = contactType === "employee";

  const filteredBySubTab = isEmployee
    ? items.filter((contact) => {
        if (selectedSubTab === "Actifs") return contact.active;
        if (selectedSubTab === "Inactifs") return !contact.active;
        return true;
      })
    : items;

  const filteredItems = filteredBySubTab.filter((contact) => {
    if (!searchTerm) return true;

    if (isEmployee) {
      const firstName = contact.firstName?.toLowerCase() || "";
      const lastName = contact.lastName?.toLowerCase() || "";
      return (
        firstName.includes(searchTerm.toLowerCase()) ||
        lastName.includes(searchTerm.toLowerCase())
      );
    } else {
      const name = contact.name?.toLowerCase() || "";
      return name.includes(searchTerm.toLowerCase());
    }
  });

  return (
    <div
      className={`p-4 flex flex-col space-y-3 h-[80vh] ${
        isTrash ? "border border-rose-300" : "border"
      }`}
    >
      <div className="flex justify-between items-center space-x-2">
        <ScrollBarSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        {!isTrash && (
          <IconButton onClick={onAdd} variant="green">
            <Plus />
          </IconButton>
        )}
      </div>

      {isEmployee && subMenuItems?.length > 0 && (
        <NavigationSubTabs
          subMenuItems={subMenuItems}
          selectedSubTab={selectedSubTab}
          setSelectedSubTab={setSelectedSubTab}
        />
      )}

      <div className="space-y-4 p-2 overflow-auto">
        {filteredItems.length > 0 && (
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
        )}
      </div>
    </div>
  );
}
