import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Login from "./components/authentification/Login.jsx";
import ProtectedRoute from "./components/authentification/ProtectedRoute.jsx";

import DocumentSigning from "./components/navbar/accounting/DocumentSigning";
import ZiedAccounting from "./components/navbar/accounting/ZiedAccounting";
import Dashboard from "./components/navbar/administration/Dashboard";
import Bank from "./components/navbar/aministrative-services/Bank";
import SillStatus from "./components/navbar/aministrative-services/SillStatus";
import EmployeeDetails from "./components/navbar/hr-services/EmployeeDetails";
import Employees from "./components/navbar/hr-services/Employees";
import Memos from "./components/navbar/hr-services/Memos";
import ParticipantDetails from "./components/navbar/participant-management/ParticipantDetails";
import Participants from "./components/navbar/participant-management/Participants";
import ParticipantProjectDetails from "./components/navbar/project-management/ParticipantProjectDetails";
import ProjectDetails from "./components/navbar/project-management/ProjectDetails";
import Projects from "./components/navbar/project-management/Projects";

import { ParticipantType, getTypeName } from "../../shared/constants/types.js";

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

  return (
    <Router>
      <Routes>
        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chantiers" element={<Projects />} />
          <Route path="/chantiers/:id" element={<ProjectDetails />} />
          <Route path="/salariés" element={<Employees />} />
          <Route path="/salariés/:id" element={<EmployeeDetails />} />
          <Route path="/notes" element={<Memos />} />
          <Route path="/banque" element={<Bank />} />
          <Route path="/statut-sill" element={<SillStatus />} />
          <Route path="/compatibilité-zied" element={<ZiedAccounting />} />
          <Route path="/document-signing" element={<DocumentSigning />} />
          {/* Routes dynamiques pour les participants */}
          {participantRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* Redirection si l'URL ne correspond à rien */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
