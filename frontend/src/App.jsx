import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/authentification/Login.jsx";
import ProtectedRoute from "./components/authentification/ProtectedRoute.jsx";

import Settings from "./components/common/Settings.jsx";
import DocumentSigning from "./components/navbar/accounting/DocumentSigning";
import ZiedAccounting from "./components/navbar/accounting/ZiedAccounting";
import LoginHistory from "./components/navbar/administration/LoginHistory.jsx";
import SignatureStamp from "./components/navbar/administration/SignatureStamp.jsx";
import TeamOverview from "./components/navbar/administration/TeamOverview.jsx";
import TrashBin from "./components/navbar/administration/TrashBin.jsx";
import UserPermissions from "./components/navbar/administration/UserPermissions.jsx";
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
          path: `/${pluralType}/:id/corbeille`,
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
        {
          path: `/chantiers/:projectId/${pluralType}/:participantId/corbeille`,
          element: <ParticipantProjectDetails participantType={type} />,
        },
      ];
    })
    .flat();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/settings" element={<Settings />} />

          <Route path="/gestion-droits" element={<UserPermissions />} />
          <Route path="/equipe" element={<TeamOverview />} />
          <Route path="/historique-connexions" element={<LoginHistory />} />
          <Route path="/corbeille" element={<TrashBin />} />
          <Route path="/tampon-signature" element={<SignatureStamp />} />

          <Route path="/chantiers" element={<Projects />} />
          <Route path="/chantiers/:id" element={<ProjectDetails />} />
          <Route
            path="/chantiers/:id/corbeille"
            element={<ProjectDetails isTrash={true} />}
          />

          <Route path="/salariés" element={<Employees />} />
          <Route path="/salariés/:id" element={<EmployeeDetails />} />
          <Route path="/salariés/:id/corbeille" element={<EmployeeDetails />} />
          <Route path="/notes" element={<Memos />} />
          <Route path="/banque" element={<Bank />} />
          <Route path="/statut-sill" element={<SillStatus />} />
          <Route path="/compatibilite-zied" element={<ZiedAccounting />} />
          <Route path="/signature-document" element={<DocumentSigning />} />

          {participantRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
}
