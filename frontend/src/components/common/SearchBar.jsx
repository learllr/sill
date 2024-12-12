import { Search } from "lucide-react";

export default function SearchBar() {
  const handleSearch = (event) => {
    console.log("Recherche :", event.target.value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Rechercher..."
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200"
        onChange={handleSearch}
      />
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-gray-700"
        aria-label="Rechercher"
      >
        <Search className="h-5 w-5" />
      </button>
    </div>
  );
}
