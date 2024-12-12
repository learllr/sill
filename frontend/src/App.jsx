import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Projects from "./components/navbar/project-management/Projects.jsx";
import ProjectDetails from "./components/navbar/project-management/ProjectDetails.jsx";
import Participants from "./components/navbar/project-management/Participants.jsx";
import ParticipantDetails from "./components/navbar/project-management/ParticipantDetails.jsx";

export default function App() {
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDeviceType("MOBILE (sm)");
      } else if (width >= 640 && width < 1024) {
        setDeviceType("TABLETTE (md)");
      } else {
        setDeviceType("ORDI (lg)");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <Route path="/bank" element={<h1>Bank</h1>} />
        <Route path="/sill-status" element={<h1>SILL Status</h1>} />
        <Route path="/accounting" element={<h1>Accounting</h1>} />
        <Route path="/zied-accounting" element={<h1>ZIED Accounting</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
