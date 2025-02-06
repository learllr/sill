import { Plus } from "lucide-react";
import ScrollBarSearch from "./ScrollBarSearch";
import DocumentCard from "./DocumentCard";
import { sortAndGroupDocuments } from "../../../../../shared/utils/organizeDocuments.js";

export default function ItemContainer({ items, onAdd, onSelectItem }) {
  const groupedByYear = sortAndGroupDocuments(items);

  return (
    <div className="border p-4 flex flex-col space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Documents</h2>
        <button
          onClick={onAdd}
          className="p-2 bg-green-500 text-white hover:bg-green-600 transition"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <ScrollBarSearch searchItems={items} />

      <div className="space-y-4 max-h-[32rem] overflow-auto p-2">
        {Object.keys(groupedByYear).map((year) => (
          <div key={year}>
            <h3 className="text-base font-bold text-gray-700 mb-1">{year}</h3>
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, max-content))",
              }}
            >
              {groupedByYear[year].map((item) => (
                <DocumentCard
                  key={item.id}
                  document={item}
                  onSelectItem={onSelectItem}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
