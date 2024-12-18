import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Bank from "./components/navbar/aministrative-services/Bank.jsx";
import SillStatus from "./components/navbar/aministrative-services/SillStatus.jsx";
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
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/participant/:typeId" element={<Participants />} />
        <Route
          path="/participant/:typeId/:id"
          element={<ParticipantDetails />}
        />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/quote/:id" element={<QuoteDetails />} />
        <Route path="/invoices" element={<h1>Invoices</h1>} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />
        <Route path="/memos" element={<Memos />} />
        <Route
          path="/administrative-services"
          element={<h1>Administrative Services</h1>}
        />
        <Route path="/bank" element={<Bank />} />
        <Route path="/sill-status" element={<SillStatus />} />
        <Route path="/accounting" element={<h1>Accounting</h1>} />
        <Route path="/zied-accounting" element={<h1>ZIED Accounting</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
