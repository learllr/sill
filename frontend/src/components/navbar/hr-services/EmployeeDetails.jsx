import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CONTACT_FIELDS } from "../../../../../shared/constants/contactFields.js";
import { precisionEmployeeMenuItems } from "../../../../../shared/constants/menuItems.js";
import ContactInfo from "../../common/Managers/ContactManager/ContactInfo.jsx";
import DocumentManager from "../../common/Managers/DocumentManager/DocumentManager.jsx";

export default function EmployeeDetails() {
  const { id } = useParams();
  const location = useLocation();
  const isTrash = location.pathname.includes("/corbeille");

  const menuItems = precisionEmployeeMenuItems;

  const [selectedMainTab, setSelectedMainTab] = useState(
    menuItems[0]?.label || ""
  );
  const [selectedSubTab, setSelectedSubTab] = useState(
    menuItems[0]?.subMenu?.[0] || ""
  );

  const employeeFields = CONTACT_FIELDS["employee"] || [];
  const fields = Array.isArray(employeeFields)
    ? employeeFields
    : employeeFields.flatMap((section) => section.fields);

  const sections = [
    {
      title: "Informations personnelles",
      fields: fields.filter(({ name }) =>
        [
          "active",
          "gender",
          "firstName",
          "lastName",
          "birthDate",
          "birthCity",
          "nationality",
          "familyStatus",
          "dependentChildren",
        ].includes(name)
      ),
    },
    {
      title: "Coordonnées",
      fields: fields.filter(({ name }) =>
        [
          "address",
          "postalCode",
          "city",
          "phone",
          "email",
          "jobTitle",
          "qualification",
        ].includes(name)
      ),
    },
    {
      title: "Contrat et salaire",
      fields: fields.filter(({ name }) =>
        [
          "contractType",
          "contractDurationMonths",
          "workTime",
          "monthlyNetSalary",
          "weeklyHours",
          "startDate",
          "endDate",
          "medicalCheckupDate",
          "socialSecurityNumber",
          "btpCard",
        ].includes(name)
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DocumentManager
        title="Détails du salarié"
        selectedMainTab={selectedMainTab}
        setSelectedMainTab={setSelectedMainTab}
        selectedSubTab={selectedSubTab}
        setSelectedSubTab={setSelectedSubTab}
        menuItems={menuItems}
        employeeId={id}
        documentScope="sub"
        isTrash={isTrash}
        ContactInfoComponent={() => (
          <ContactInfo
            sections={sections}
            contactId={id}
            contactType="employee"
            isTrash={isTrash}
          />
        )}
      />
    </div>
  );
}
