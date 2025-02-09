import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTypeName } from "../../../../../../shared/constants/types.js";
import { useContacts } from "../../../../hooks/useContacts.jsx";
import Loading from "../../Design/Loading.jsx";
import Section from "../Section.jsx";
import AddContainer from "./AddContainer.jsx";
import ItemContainer from "./ItemContainer.jsx";

export default function ContactManager({
  title,
  contactType,
  menuItems,
  selectedSubTab,
  setSelectedSubTab,
}) {
  const navigate = useNavigate();
  const subMenuItems = menuItems?.[0]?.subMenu || [];

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState("");

  const { contacts, isLoading, isError, addMutation } =
    useContacts(contactType);

  return (
    <div>
      <Section title={title} />

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex space-x-2">
        <div className={isDetailVisible ? "w-2/3" : "w-full"}>
          {isLoading && <Loading />}
          {isError && <p>Erreur lors du chargement des contacts.</p>}
          {!isLoading && !isError && (
            <ItemContainer
              items={contacts || []}
              subMenuItems={subMenuItems}
              selectedSubTab={selectedSubTab}
              setSelectedSubTab={setSelectedSubTab}
              onAdd={() => {
                setIsDetailVisible(true);
                setIsAddingNew(true);
              }}
              onSelectItem={(contact) => {
                if (contactType === "employee") {
                  navigate(`/salariés/${contact.id}`);
                } else {
                  navigate(
                    `/${getTypeName(contactType, "plural")}/${contact.id}`
                  );
                }
              }}
              contactType={contactType}
            />
          )}
        </div>

        {isDetailVisible && (
          <div className="w-1/3">
            <AddContainer
              onClose={() => {
                setIsDetailVisible(false);
              }}
              isNew={isAddingNew}
              contactType={contactType}
              addMutation={addMutation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
