import { useState, useEffect } from "react";
import { useMutation } from "react-query";
import axios from "../../../../axiosConfig.js";

export default function InvoiceList({ participant }) {
  const { id, projectId } = participant.ProjectParticipant;
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(`/invoice/${id}/${projectId}`);
      console.log(data);
      return data;
    },
    onSuccess: (data) => {
      setInvoices(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Erreur lors de la récupération des factures :", error);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setIsLoading(true);
    fetchInvoices.mutate();
  }, [id, projectId]);

  return (
    <div className="mt-4">
      {isLoading ? (
        <p className="p-4">Chargement des factures...</p>
      ) : invoices.length > 0 ? (
        <ul className="p-4 space-y-4">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="border-b py-2 flex items-center space-x-4"
            >
              {invoice.imagePath && (
                <img
                  src={invoice.imagePath}
                  alt={`Image de ${invoice.title}`}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{invoice.title}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm">Aucune facture trouvée.</p>
      )}
    </div>
  );
}
