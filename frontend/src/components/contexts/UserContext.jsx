import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "../../axiosConfig.js";
import { useMessageDialog } from "../contexts/MessageDialogContext";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const queryClient = useQueryClient();
  const { showMessage } = useMessageDialog();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile().then((data) => {
        if (data) {
          setUser(data);
          setRoleId(data.roleId);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const { data: userProfile } = useQuery("userProfile", fetchUserProfile, {
    enabled: !!localStorage.getItem("token"),
    onSuccess: (data) => {
      setUser(data);
      setRoleId(data.roleId);
      setIsAuthenticated(true);
    },
    onError: () => {
      setUser(null);
      setRoleId(null);
      setIsAuthenticated(false);
    },
  });

  async function fetchUserProfile() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const response = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/authentification/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries("userProfile");
      showMessage("success", "Connexion réussie !");
      return { success: true, message: "Connexion réussie !" };
    } catch (error) {
      setIsAuthenticated(false);
      showMessage(
        "error",
        error.response?.data?.error || "Erreur lors de la connexion."
      );
      return {
        success: false,
        message: error.response?.data?.error || "Erreur lors de la connexion.",
      };
    }
  };

  const logoutUser = async () => {
    try {
      await axios.post("/authentification/logout");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      queryClient.clear();
      showMessage("success", "Déconnexion réussie !");
    } catch (error) {
      showMessage("error", "Erreur lors de la déconnexion.");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: userProfile || user,
        isAuthenticated,
        roleId,
        loginUser,
        logoutUser,
      }}
    >
      {isAuthenticated === null ? null : children}
    </UserContext.Provider>
  );
};
