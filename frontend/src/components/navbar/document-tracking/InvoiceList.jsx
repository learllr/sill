import React from "react";
import { useNavigate } from "react-router-dom";
import { highlightText } from "../../../../utils/textUtils.js";

export default function InvoiceList({ invoices, searchTerm }) {
  const navigate = useNavigate();

  if (!invoices || invoices.length === 0) {
    return <p className="text-center text-gray-500">Aucune facture.</p>;
  }

  return (
    <ul>
      {invoices.map((invoice) => (
        <li key={invoice.id} className="mb-2">
          <button
            onClick={() => navigate(`/facture/${invoice.id}`)}
            className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            <p
              className="leading-tight"
              dangerouslySetInnerHTML={{
                __html: highlightText(invoice.title, searchTerm),
              }}
            />
            <p
              className="text-xs text-gray-400 whitespace-nowrap"
              dangerouslySetInnerHTML={{
                __html: highlightText(invoice.invoiceNumber, searchTerm),
              }}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
