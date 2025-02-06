import { useState } from "react";
import { Search } from "lucide-react";

export default function ScrollBarSearch({ searchItems }) {
  const [searchTerm, setSearchTerm] = useState("");

  // const filteredItems = searchItems.filter((item) =>
  //   item.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="border w-full flex items-center gap-2 p-1">
      <Search className="w-5 h-5 text-gray-500 ml-2" />
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-1 outline-none bg-transparent"
        maxLength={50}
      />
    </div>
  );
}
