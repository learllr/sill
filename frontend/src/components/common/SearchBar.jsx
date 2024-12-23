import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { highlightText } from "../../../utils/textUtils.js";
import axios from "../../axiosConfig.js";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      const response = await axios.get("/search");
      setResults(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (query.length >= 1) {
      const filteredResults = results.filter((result) =>
        result.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      fetchAllData();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (results.length === 0) {
      fetchAllData();
    }
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  };

  const handleResultClick = (id, type) => {
    if (
      type === "client" ||
      type === "fournisseur" ||
      type === "sous-traitant" ||
      type === "architecte"
    ) {
      const typeIdMap = {
        client: 1,
        fournisseur: 2,
        "sous-traitant": 3,
        architecte: 4,
      };

      const typeId = typeIdMap[type];
      navigate(`/participant/${typeId}/${id}`);
    } else {
      navigate(`/${type}/${id}`);
    }
  };

  return (
    <div
      className="relative flex flex-col w-full"
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <div className="relative flex w-full items-center">
        <Input
          type="text"
          placeholder="Rechercher un chantier, client, fournisseur, sous-traitant, architecte ou salarié..."
          className="pr-10 text-sm"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
          <Search className="h-5 w-5" />
        </div>
      </div>
      {isFocused && (
        <ul className="absolute z-10 mt-11 w-full bg-white border-l border-b border-r border-gray-200 rounded-bl-lg rounded-br-lg shadow-lg max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map((result) => (
              <li
                key={`${result.type}-${result.id}`}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleResultClick(result.id, result.type)}
              >
                <span
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(result.name, searchTerm),
                  }}
                />
                <span className="text-xs text-gray-500">
                  {result.type.toUpperCase()}
                </span>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500 text-sm">
              Aucun résultat trouvé pour cette recherche.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
