import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "../../axiosConfig.js";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roleId, setRoleId] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      queryClient.prefetchQuery("userProfile", fetchUserProfile);
    }
  }, [queryClient]);

  const { data: userProfile } = useQuery("userProfile", fetchUserProfile, {
    enabled: isAuthenticated,
    onSuccess: (data) => {
      setUser(data);
      setRoleId(data.roleId);
      setIsAuthenticated(true);
    },
    onError: () => {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    },
  });

  async function fetchUserProfile() {
    const token = localStorage.getItem("token");
    const response = await axios.get("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  const signupUser = async (userData) => {
    try {
      const response = await axios.post("/authentification/signup", userData);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries("userProfile");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Erreur lors de l'inscription",
      };
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("/authentification/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries("userProfile");
      return { success: true, message: "Connexion réussie !" };
    } catch (error) {
      setIsAuthenticated(false);
      return {
        success: false,
        message: error.response?.data?.error || "Erreur lors de la connexion",
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
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: userProfile || user,
        isAuthenticated,
        roleId,
        signupUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
