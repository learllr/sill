import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ParticipantType, getTypeName } from "../../shared/constants/types.js";
import GlobalBody from "./components/common/GlobalBody.jsx";
import ZiedAccounting from "./components/navbar/accounting/ZiedAccounting.jsx";
import Bank from "./components/navbar/aministrative-services/Bank.jsx";
import SillStatus from "./components/navbar/aministrative-services/SillStatus.jsx";
import EmployeeDetails from "./components/navbar/hr-services/EmployeeDetails.jsx";
import Employees from "./components/navbar/hr-services/Employees.jsx";
import Memos from "./components/navbar/hr-services/Memos.jsx";
import ParticipantDetails from "./components/navbar/project-management/ParticipantDetails.jsx";
import Participants from "./components/navbar/project-management/Participants.jsx";
import ProjectDetails from "./components/navbar/project-management/ProjectDetails.jsx";
import Projects from "./components/navbar/project-management/Projects.jsx";

export default function App() {
  const routes = [
    { path: "/", element: <Projects /> },
    { path: "/chantiers", element: <Projects /> },
    { path: "/chantier/:id", element: <ProjectDetails /> },
    { path: "/salariés", element: <Employees /> },
    { path: "/salariés/:id", element: <EmployeeDetails /> },
    { path: "/notes", element: <Memos /> },
    { path: "/banque", element: <Bank /> },
    { path: "/statut-sill", element: <SillStatus /> },
    { path: "/compatibilité-zied", element: <ZiedAccounting /> },
    ...Object.values(ParticipantType).map((type) => ({
      path: `/${getTypeName(type, "plural")}`,
      element: <Participants participantType={type} />,
    })),
    ...Object.values(ParticipantType).map((type) => ({
      path: `/${getTypeName(type, "plural")}/:id`,
      element: <ParticipantDetails participantType={type} />,
    })),
    { path: "*", element: <h1>URL non trouvée</h1> },
  ];

  return (
    <Router>
      <GlobalBody>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </GlobalBody>
    </Router>
  );
}
