import React, { createContext, useContext, useState } from "react";
import MessageDialog from "../dialogs/MessageDialog";

const MessageDialogContext = createContext();

export const useMessageDialog = () => {
  return useContext(MessageDialogContext);
};

export const MessageDialogProvider = ({ children }) => {
  const [messageDialog, setMessageDialog] = useState({
    isOpen: false,
    type: "info",
    message: "",
  });

  const showMessage = (type, message) => {
    setMessageDialog({ isOpen: true, type, message });
  };

  const hideMessage = () => {
    setMessageDialog({ ...messageDialog, isOpen: false });
  };

  return (
    <MessageDialogContext.Provider value={{ showMessage, hideMessage }}>
      {children}

      <MessageDialog
        isOpen={messageDialog.isOpen}
        onClose={hideMessage}
        type={messageDialog.type}
        message={messageDialog.message}
      />
    </MessageDialogContext.Provider>
  );
};
