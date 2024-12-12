import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import LogoutDialog from "../dialogs/LogoutDialog";
import Alert from "./Alert.jsx";

export default function NavBar() {
  const { user, isAuthenticated, logoutUser } = useUser();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const openLogoutDialog = () => setShowLogoutDialog(true);
  const closeLogoutDialog = () => setShowLogoutDialog(false);

  const handleLogout = () => {
    closeLogoutDialog();
    logoutUser();
    navigate("/");
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-gray-800 flex">
            <div className="flex items-center gap-4 hover:text-zinc-700">
              <img
                src="/logos/skeleton.png"
                alt="SILL"
                width={50}
                height={50}
              />
              SILL
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="text-primary border-primary hover:text-primary/80 hover:border-primary/80 hover:bg-white"
                  >
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="text-white bg-primary hover:bg-primary/90">
                    Inscription
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/settings"
                  className="text-gray-700 hover:text-gray-900"
                >
                  <FiSettings title="Paramètres" className="text-xl" />
                </Link>
                <button
                  onClick={openLogoutDialog}
                  className="text-gray-700 hover:text-gray-900"
                >
                  <FiLogOut title="Déconnexion" className="text-xl" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="icon"
              className="text-gray-700 hover:text-gray-900 transition-transform"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden px-4 bg-white transition-all duration-1000 transform ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          {!isAuthenticated ? (
            <div className="space-y-1 font-semibold mb-4">
              <Link
                to="/login"
                className="block text-primary border-primary hover:text-primary/80 hover:border-primary/80 hover:bg-white px-4 py-2 border-[1px] rounded-md"
              >
                Connexion
              </Link>
              <Link
                to="/signup"
                className="block text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-md"
              >
                Inscription
              </Link>
            </div>
          ) : (
            <div className="space-y-1 font-semibold mb-4">
              <Link
                to="/settings"
                className="block text-gray-700 hover:text-gray-900 py-2"
              >
                Paramètres
              </Link>
              <button
                onClick={openLogoutDialog}
                className="block text-gray-700 hover:text-gray-900 py-2"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>

        {/* Logout Dialog */}
        <LogoutDialog
          isVisible={showLogoutDialog}
          onClose={closeLogoutDialog}
          onConfirm={handleLogout}
        />
      </nav>
      <Alert />
    </>
  );
}
