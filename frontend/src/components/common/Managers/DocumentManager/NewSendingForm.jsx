import { useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";

export default function NewSendingForm({
  onSave,
  addMutation,
  selectedDocuments,
  isDOE,
  projectId,
  showMessage,
}) {
  const [formFields, setFormFields] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (selectedDocuments.length === 0) {
      showMessage("error", "Veuillez sélectionner au moins un document.");
      return;
    }

    if (!formFields.date) {
      showMessage("error", "La date est obligatoire.");
      return;
    }

    const formData = new FormData();
    formData.append("name", formFields.name);
    formData.append("date", formFields.date);
    formData.append("remarks", formFields.remarks);
    if (projectId) formData.append("projectId", projectId);
    formData.append("documentIds", JSON.stringify(selectedDocuments));
    formData.append("type", isDOE ? "DOE" : "CEDIG");

    addMutation.mutate(formData, {
      onSuccess: () => {
        showMessage("success", "L'envoi a été ajouté avec succès.");
        onSave();
      },
      onError: () => {
        showMessage("error", "Erreur lors de l'ajout de l'envoi.");
      },
    });
  };

  return (
    <div className="p-2 space-y-3">
      <h1 className="text-lg font-semibold text-center mb-5">
        Ajouter un nouvel envoi
      </h1>
      <p className="text-center">
        Cochez les documents à insérer dans l'envoi.
      </p>

      <label className="block">
        <span className="text-gray-700">Nom</span>
        <input
          type="text"
          name="name"
          value={formFields.name}
          onChange={handleChange}
          className="block w-full mt-1 border rounded-md p-2"
          required
        />
      </label>

      <label className="block">
        <span className="text-gray-700">
          Date <span className="text-red-500">*</span>
        </span>
        <input
          type="date"
          name="date"
          value={formFields.date}
          onChange={handleChange}
          className="block w-full mt-1 border rounded-md p-2"
          required
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Remarques</span>
        <textarea
          name="remarks"
          value={formFields.remarks}
          onChange={handleChange}
          className="block w-full mt-1 border rounded-md p-2"
        />
      </label>

      <IconButton onClick={handleSubmit} className="w-full" variant="blue">
        Valider l'envoi
      </IconButton>
    </div>
  );
}
