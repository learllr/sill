import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import axios from "../../../../axiosConfig.js";

export default function QuoteList({ participant }) {
  const { id, projectId } = participant.ProjectParticipant;
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuotes = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(`/quote/${id}/${projectId}`);
      return data;
    },
    onSuccess: (data) => {
      setQuotes(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Erreur lors de la récupération des devis :", error);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchQuotes.mutate();
  }, [id, projectId]);

  return (
    <div className="mt-4">
      {isLoading ? (
        <p className="p-4">Chargement des devis...</p>
      ) : quotes.length > 0 ? (
        <ul className="p-4 space-y-4">
          {quotes.map((quote) => (
            <li
              key={quote.id}
              className="border-b py-2 flex items-center space-x-4"
            >
              {quote.imagePath && (
                <img
                  src={quote.imagePath}
                  alt={`Image de ${quote.title}`}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{quote.title}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm">Aucun devis trouvé.</p>
      )}
    </div>
  );
}
