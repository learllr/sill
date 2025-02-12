import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ParticipantType, getTypeName } from "../../shared/constants/types.js";
import GlobalBody from "./components/common/GlobalBody.jsx";
import DocumentSigning from "./components/navbar/accounting/DocumentSigning.jsx";
import ZiedAccounting from "./components/navbar/accounting/ZiedAccounting.jsx";
import Bank from "./components/navbar/aministrative-services/Bank.jsx";
import SillStatus from "./components/navbar/aministrative-services/SillStatus.jsx";
import EmployeeDetails from "./components/navbar/hr-services/EmployeeDetails.jsx";
import Employees from "./components/navbar/hr-services/Employees.jsx";
import Memos from "./components/navbar/hr-services/Memos.jsx";
import ParticipantDetails from "./components/navbar/participant-management/ParticipantDetails.jsx";
import ParticipantProjectDetails from "./components/navbar/participant-management/ParticipantProjectDetails.jsx";
import Participants from "./components/navbar/participant-management/Participants.jsx";
import ProjectDetails from "./components/navbar/project-management/ProjectDetails.jsx";
import Projects from "./components/navbar/project-management/Projects.jsx";

export default function App() {
  const participantRoutes = Object.values(ParticipantType)
    .map((type) => {
      const pluralType = getTypeName(type, "plural");

      return [
        {
          path: `/${pluralType}`,
          element: <Participants participantType={type} />,
        },
        {
          path: `/${pluralType}/:id`,
          element: <ParticipantDetails participantType={type} />,
        },
        {
          path: `/chantiers/:projectId/${pluralType}`,
          element: <Participants participantType={type} />,
        },
        {
          path: `/chantiers/:projectId/${pluralType}/:participantId`,
          element: <ParticipantProjectDetails participantType={type} />,
        },
      ];
    })
    .flat();

  const routes = [
    { path: "/", element: <Projects /> },
    { path: "/chantiers", element: <Projects /> },
    { path: "/chantiers/:id", element: <ProjectDetails /> },
    { path: "/salariés", element: <Employees /> },
    { path: "/salariés/:id", element: <EmployeeDetails /> },
    { path: "/notes", element: <Memos /> },
    { path: "/banque", element: <Bank /> },
    { path: "/statut-sill", element: <SillStatus /> },
    { path: "/compatibilité-zied", element: <ZiedAccounting /> },
    { path: "/document-signing", element: <DocumentSigning /> },
    ...participantRoutes,
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
