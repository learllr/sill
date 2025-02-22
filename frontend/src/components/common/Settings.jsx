import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useUsers } from "../../hooks/useUsers";
import ActionButton from "../common/Design/Buttons/ActionButton.jsx";
import { useMessageDialog } from "../contexts/MessageDialogContext";
import { useUser } from "../contexts/UserContext.jsx";
import IconButton from "./Design/Buttons/IconButton.jsx";

export default function Settings() {
  const { updateMutation } = useUsers();
  const { user } = useUser();
  const { showMessage } = useMessageDialog();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const [isModified, setIsModified] = useState(false);
  const isUpdating = updateMutation.isLoading;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const isFieldsModified =
        formData.firstName !== user.firstName ||
        formData.lastName !== user.lastName ||
        formData.email !== user.email ||
        formData.password ||
        formData.confirmPassword;

      setIsModified(isFieldsModified);
    }
  }, [formData, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      showMessage("error", "Les mots de passe ne correspondent pas.");
      return;
    }

    const { confirmPassword, ...dataToSend } = formData;

    updateMutation.mutate(
      { id: user.id, updatedData: dataToSend },
      {
        onSuccess: () => {
          showMessage("success", "Votre compte a été mis à jour avec succès.");
          queryClient.invalidateQueries("userProfile");
          setIsEditing(false);
        },
        onError: () => {
          showMessage(
            "error",
            "Une erreur est survenue lors de la mise à jour."
          );
        },
      }
    );
  };

  return (
    <div>
      <div className="flex justify-center items-center mt-10">
        <div className="p-5 bg-white rounded-lg border max-w-md w-full relative">
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
                <ActionButton
                  type="submit"
                  disabled={isUpdating || !isModified}
                  variant="blue"
                >
                  {isUpdating ? "Modification en cours..." : "Enregistrer"}
                </ActionButton>

                <ActionButton
                  onClick={() => setIsEditing(false)}
                  variant="gray"
                >
                  Annuler
                </ActionButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
