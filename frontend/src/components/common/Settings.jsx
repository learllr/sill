import { Edit } from "lucide-react";
import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import IconButton from "../common/Design/Buttons/IconButton.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import MessageDialog from "../dialogs/MessageDialog.jsx";

export default function Settings() {
  const { updateMutation } = useUsers();
  const { user } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [messageDialog, setMessageDialog] = useState({
    isOpen: false,
    type: "info",
    message: "",
  });

  const isUpdating = updateMutation.isLoading;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessageDialog({
        isOpen: true,
        type: "error",
        message: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;

    updateMutation.mutate(
      { id: user.id, updatedData: dataToSend },
      {
        onSuccess: () => {
          setMessageDialog({
            isOpen: true,
            type: "success",
            message: "Votre compte a été mis à jour avec succès.",
          });
          setIsEditing(false);
        },
        onError: () => {
          setMessageDialog({
            isOpen: true,
            type: "error",
            message: "Une erreur est survenue lors de la mise à jour.",
          });
        },
      }
    );
  };

  return (
    <div>
      <div className="flex justify-center items-center mt-10">
        <div className="p-8 bg-white rounded-lg border max-w-md w-full relative">
          {!isEditing && (
            <IconButton
              onClick={() => setIsEditing(true)}
              variant="blue"
              className="absolute top-4 right-4"
            >
              <Edit className="w-5 h-5" />
            </IconButton>
          )}

          <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
            Paramètres du compte
          </h1>

          {!isEditing ? (
            <div className="space-y-4 text-center">
              <p>
                <strong>Prénom:</strong> {user.firstName}
              </p>
              <p>
                <strong>Nom:</strong> {user.lastName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Prénom"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nom"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nouveau mot de passe (laisser vide si inchangé)"
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmer le mot de passe"
                className="w-full p-2 border rounded"
              />

              <div className="flex space-x-2">
                <IconButton
                  onClick={handleSubmit}
                  disabled={isUpdating}
                  variant="blue"
                  className="w-full"
                >
                  {isUpdating ? "Modification en cours..." : "Enregistrer"}
                </IconButton>

                <IconButton
                  onClick={() => setIsEditing(false)}
                  variant="gray"
                  className="w-full"
                >
                  Annuler
                </IconButton>
              </div>
            </form>
          )}
        </div>
      </div>

      <MessageDialog
        isOpen={messageDialog.isOpen}
        onClose={() => setMessageDialog({ ...messageDialog, isOpen: false })}
        type={messageDialog.type}
        message={messageDialog.message}
      />
    </div>
  );
}
