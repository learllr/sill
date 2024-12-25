import React, { useState } from "react";
import { useQuery } from "react-query";
import { highlightText } from "../../../../utils/textUtils.js";
import axios from "../../../axiosConfig.js";
import Body from "../../common/Body.jsx";
import GeneralHeaderActions from "../../common/Pages/GeneralHeaderActions.jsx";

export default function ZiedAccounting() {
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInvoices = async () => {
    const response = await axios.get("/invoice");
    return response.data;
  };

  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery("invoices", fetchInvoices);

  const filteredInvoices = invoices?.filter(
    (invoice) =>
      invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.participant?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.project?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Body>
      <div className="px-4 w-full">
        <GeneralHeaderActions
          title="Factures"
          searchValue={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
          onAdd={() => console.log("Ajout d'une facture")}
          onReset={() => setSearchTerm("")}
        />

        {isLoading ? (
          <p className="text-center">Chargement des factures...</p>
        ) : error ? (
          <p className="text-center text-red-500">
            Erreur lors de la récupération des factures.
          </p>
        ) : filteredInvoices?.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {filteredInvoices.map((invoice) => (
              <li key={invoice.id}>
                <div className="w-full flex items-center justify-between px-4 py-3 border rounded-md text-gray-700 hover:bg-gray-100 transition">
                  <div className="text-sm flex flex-col items-start">
                    <p
                      className="font-medium"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(invoice.title, searchTerm),
                      }}
                    />
                    <p
                      className="text-xs text-gray-500"
                      dangerouslySetInnerHTML={{
                        __html: `${highlightText(
                          invoice.participant?.name || "Entité inconnue",
                          searchTerm
                        )} - ${highlightText(
                          invoice.project?.name || "Chantier inconnu",
                          searchTerm
                        )}`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Aucune facture trouvée.</p>
        )}
      </div>
    </Body>
  );
}
