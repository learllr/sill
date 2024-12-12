import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export function AlertProvider({ children }) {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("destructive");

  const showAlert = (message, type = "destructive") => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const clearAlert = () => setAlertMessage("");

  return (
    <AlertContext.Provider
      value={{ alertMessage, alertType, showAlert, clearAlert }}
    >
      {children}
    </AlertContext.Provider>
  );
}
