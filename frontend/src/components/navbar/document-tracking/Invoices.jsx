import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body";

export default function Invoices() {
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    const response = await axios.get("/invoice");
    return response.data;
  };

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery("invoices", fetchInvoices);

  if (isLoading) return <Body children={<p>Chargement des factures...</p>} />;
  if (error)
    return (
      <Body children={<p>Erreur lors de la récupération des factures.</p>} />
    );

  return (
    <Body>
      <div className="px-4 w-full">
        <h1 className="text-2xl font-semibold mb-6">Liste des factures</h1>
        {invoices.length > 0 ? (
          <ul>
            {invoices.map((invoice) => (
              <li key={invoice.id} className="mb-2">
                <button
                  onClick={() => navigate(`/facture/${invoice.id}`)}
                  className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                  <div className="text-sm flex flex-col items-start">
                    <p className="leading-tight">{invoice.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(invoice.paidOn).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {invoice.invoiceNumber}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Aucune facture.</p>
        )}
      </div>
    </Body>
  );
}
