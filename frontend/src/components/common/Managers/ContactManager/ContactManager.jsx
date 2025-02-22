import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTypeName } from "../../../../../../shared/constants/types.js";
import { useContacts } from "../../../../hooks/useContacts.jsx";
import { useMessageDialog } from "../../../contexts/MessageDialogContext.jsx";
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
  isTrash = false,
}) {
  const navigate = useNavigate();
  const subMenuItems = menuItems?.[0]?.subMenu || [];
  const { showMessage } = useMessageDialog();

  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const { contacts, isLoading, isError, addMutation } =
    useContacts(contactType);

  const allContacts =
    contacts?.filter((contact) => contact.deleted === isTrash) || [];

  useEffect(() => {
    if (isError) {
      showMessage(
        "error",
        `Erreur lors du chargement des ${
          contactType === "employee"
            ? "salariés"
            : `${contactType.toLowerCase()}s`
        }.`
      );
    }
  }, [isError, contactType]);

  return (
    <div>
      {title && <Section title={title} />}

      <div className="flex space-x-2">
        <div className={isDetailVisible ? "w-2/3" : "w-full"}>
          {isLoading && <Loading />}
          {!isLoading && !isError && (
            <ItemContainer
              items={allContacts || []}
              subMenuItems={subMenuItems}
              selectedSubTab={selectedSubTab}
              setSelectedSubTab={setSelectedSubTab}
              onAdd={() => {
                setIsDetailVisible(true);
                setIsAddingNew(true);
              }}
              onSelectItem={(contact) => {
                if (contactType === "employee") {
                  navigate(
                    `/salariés/${contact.id}${isTrash ? "/corbeille" : ""}`
                  );
                } else {
                  navigate(
                    `/${getTypeName(contactType, "plural")}/${contact.id}${
                      isTrash ? "/corbeille" : ""
                    }`
                  );
                }
              }}
              contactType={contactType}
              isTrash={isTrash}
              showMessage={showMessage}
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
              showMessage={showMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
