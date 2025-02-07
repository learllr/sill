import { Plus } from "lucide-react";
import { useState } from "react";
import { sortAndGroupDocuments } from "../../../../../shared/utils/organizeDocuments.js";
import NavigationSubTabs from "../Buttons/NavigationSubTabs.jsx";
import IconButton from "./Design/IconButton.jsx";
import DocumentCard from "./DocumentCard";
import ScrollBarSearch from "./ScrollBarSearch";

export default function ItemContainer({
  items,
  subMenuItems,
  selectedSubTab,
  setSelectedSubTab,
  onAdd,
  onSelectItem,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;

    const year = item.year ? item.year.toString() : "";
    const month = item.month ? item.month.toLowerCase() : "";

    const searchTerms = searchTerm.toLowerCase().split(" ");

    return searchTerms.every(
      (term) => year.includes(term) || month.includes(term)
    );
  });

  const groupedByYear = sortAndGroupDocuments(filteredItems);

  return (
    <div className="border p-4 flex flex-col space-y-3 h-[64vh]">
      <div className="flex justify-between items-center space-x-2">
        <ScrollBarSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <IconButton onClick={onAdd} variant="green">
          <Plus />
        </IconButton>
      </div>

      {setSelectedSubTab && subMenuItems.length > 0 && (
        <NavigationSubTabs
          subMenuItems={subMenuItems}
          selectedSubTab={selectedSubTab}
          setSelectedSubTab={setSelectedSubTab}
        />
      )}

      <div className="space-y-4 p-2 overflow-auto">
        {Object.keys(groupedByYear).length > 0 ? (
          Object.entries(groupedByYear).map(([year, docs]) => (
            <div key={year}>
              <h3 className="text-base font-bold text-gray-700 mb-1">{year}</h3>
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, max-content))",
                }}
              >
                {docs.map((item) => (
                  <DocumentCard
                    key={item.id}
                    document={item}
                    onSelectItem={onSelectItem}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun document trouvé</p>
        )}
      </div>
    </div>
  );
}
