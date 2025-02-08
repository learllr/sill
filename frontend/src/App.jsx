import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import GlobalBody from "./components/common/GlobalBody.jsx";
import ZiedAccounting from "./components/navbar/accounting/ZiedAccounting.jsx";
import Bank from "./components/navbar/aministrative-services/Bank.jsx";
import SillStatus from "./components/navbar/aministrative-services/SillStatus.jsx";
import EmployeeDetails from "./components/navbar/hr-services/EmployeeDetails.jsx";
import Employees from "./components/navbar/hr-services/Employees.jsx";
import Memos from "./components/navbar/hr-services/Memos.jsx";
import Participants from "./components/navbar/project-management/Participants.jsx";
import ProjectDetails from "./components/navbar/project-management/ProjectDetails.jsx";
import Projects from "./components/navbar/project-management/Projects.jsx";

export default function App() {
  const participantTypes = [
    { id: 1, name: "client" },
    { id: 2, name: "fournisseur" },
    { id: 3, name: "sous-traitant" },
    { id: 4, name: "architecte" },
  ];

  return (
    <Router>
      <GlobalBody>
        <Routes>
          <Route index element={<Projects />} />
          <Route path="/chantiers" element={<Projects />} />
          <Route path="/chantier/:id" element={<ProjectDetails />} />
          {participantTypes.map(({ id, name }) => (
            <Route
              key={name}
              path={`/${name}s`}
              element={<Participants typeId={id} />}
            />
          ))}

          <Route path="/salariés" element={<Employees />} />
          <Route path="/salariés/:id" element={<EmployeeDetails />} />
          <Route path="/notes" element={<Memos />} />
          <Route
            path="/administrative-services"
            element={<h1>Administrative Services</h1>}
          />
          <Route path="/banque" element={<Bank />} />
          <Route path="/statut-sill" element={<SillStatus />} />
          <Route path="/compatibilité-zied" element={<ZiedAccounting />} />
          <Route path="*" element={<h1>URL non trouvée</h1>} />
        </Routes>
      </GlobalBody>
    </Router>
  );
}
