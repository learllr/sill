import React from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "../../../../src/axiosConfig.js";
import Body from "../../common/Body";

export default function Quotes() {
  const navigate = useNavigate();

  const fetchQuotes = async () => {
    const response = await axios.get("/quote");
    return response.data;
  };

  const { data: quotes, isLoading, error } = useQuery("quotes", fetchQuotes);

  if (isLoading) return <Body children={<p>Chargement des devis...</p>} />;
  if (error)
    return <Body children={<p>Erreur lors de la récupération des devis.</p>} />;

  return (
    <Body>
      <div className="px-4 w-full">
        <h1 className="text-2xl font-semibold mb-6">Liste des devis</h1>
        {quotes.length > 0 ? (
          <ul>
            {quotes.map((quote) => (
              <li key={quote.id} className="mb-2">
                <button
                  onClick={() => navigate(`/quote/${quote.id}`)}
                  className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="text-sm flex flex-col items-start">
                    <p className="leading-tight">{quote.title}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(quote.sentOn).toLocaleDateString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Aucun devis.</p>
        )}
      </div>
    </Body>
  );
}
