import React, { useState } from "react";
import { useContacts } from "../../../../hooks/useContacts.jsx";
import Loading from "../../Design/Loading.jsx";
import Section from "../Section.jsx";
import DetailContainer from "./DetailContainer.jsx";
import ItemContainer from "./ItemContainer.jsx";

export default function ContactManager({
  title,
  contactType,
  menuItems,
  selectedSubTab,
  setSelectedSubTab,
}) {
  const subMenuItems = menuItems?.[0]?.subMenu || [];

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [error, setError] = useState("");

  const {
    contacts,
    isLoading,
    isError,
    addMutation,
    deleteMutation,
    updateMutation,
  } = useContacts(contactType);

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
                setSelectedContact(null);
              }}
              onSelectItem={(contact) => {
                setIsDetailVisible(true);
                setIsAddingNew(false);
                setSelectedContact(contact);
              }}
              contactType={contactType}
            />
          )}
        </div>

        {isDetailVisible && (
          <div className="w-1/3">
            <DetailContainer
              onClose={() => {
                setIsDetailVisible(false);
                setSelectedContact(null);
              }}
              isNew={isAddingNew}
              contactType={contactType}
              contact={selectedContact}
              addMutation={addMutation}
              deleteMutation={deleteMutation}
              updateMutation={updateMutation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
