import React from "react";

export default function NavigationSubTabs({
  subMenuItems,
  selectedSubTab,
  setSelectedSubTab,
}) {
  if (subMenuItems.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 border-b pb-2">
      {subMenuItems.map((sub) => (
        <button
          key={sub}
          onClick={() => setSelectedSubTab(sub)}
          className={`px-3 py-1 text-sm font-medium rounded uppercase ${
            selectedSubTab === sub
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {sub}
        </button>
      ))}
    </div>
  );
}
