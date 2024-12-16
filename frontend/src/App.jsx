import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Bank from "./components/navbar/aministrative-services/Bank.jsx";
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
        <Route path="/quotes-invoices" element={<h1>Quotes and Invoices</h1>} />
        <Route path="/quotes" element={<h1>Quotes</h1>} />
        <Route path="/invoices" element={<h1>Invoices</h1>} />
        <Route path="/hr-services" element={<h1>HR Services</h1>} />
        <Route path="/employees" element={<h1>Employees</h1>} />
        <Route path="/memos" element={<h1>Memos</h1>} />
        <Route
          path="/administrative-services"
          element={<h1>Administrative Services</h1>}
        />
        <Route path="/bank" element={<Bank />} />
        <Route path="/sill-status" element={<h1>SILL Status</h1>} />
        <Route path="/accounting" element={<h1>Accounting</h1>} />
        <Route path="/zied-accounting" element={<h1>ZIED Accounting</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
