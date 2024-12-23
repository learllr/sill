import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Bank from "./components/navbar/aministrative-services/Bank.jsx";
import SillStatus from "./components/navbar/aministrative-services/SillStatus.jsx";
import InvoiceDetails from "./components/navbar/document-tracking/InvoiceDetails.jsx";
import Invoices from "./components/navbar/document-tracking/Invoices.jsx";
import QuoteDetails from "./components/navbar/document-tracking/QuoteDetails.jsx";
import Quotes from "./components/navbar/document-tracking/Quotes.jsx";
import EmployeeDetails from "./components/navbar/hr-services/EmployeeDetails.jsx";
import Employees from "./components/navbar/hr-services/Employees.jsx";
import Memos from "./components/navbar/hr-services/Memos.jsx";
import ParticipantDetails from "./components/navbar/project-management/ParticipantDetails.jsx";
import Participants from "./components/navbar/project-management/Participants.jsx";
import ProjectDetails from "./components/navbar/project-management/ProjectDetails.jsx";
import Projects from "./components/navbar/project-management/Projects.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chantiers" element={<Projects />} />
        <Route path="/chantier/:id" element={<ProjectDetails />} />
        <Route path="/participant/:typeId" element={<Participants />} />
        <Route
          path="/participant/:typeId/:id"
          element={<ParticipantDetails />}
        />
        <Route path="/devis" element={<Quotes />} />
        <Route path="/devis/:id" element={<QuoteDetails />} />
        <Route path="/factures" element={<Invoices />} />
        <Route path="/facture/:id" element={<InvoiceDetails />} />
        <Route path="/salariés" element={<Employees />} />
        <Route path="/salarié/:id" element={<EmployeeDetails />} />
        <Route path="/notes-de-service" element={<Memos />} />
        <Route
          path="/administrative-services"
          element={<h1>Administrative Services</h1>}
        />
        <Route path="/banque" element={<Bank />} />
        <Route path="/statut-sill" element={<SillStatus />} />
        <Route path="/accounting" element={<h1>Accounting</h1>} />
        <Route path="/zied-accounting" element={<h1>ZIED Accounting</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
