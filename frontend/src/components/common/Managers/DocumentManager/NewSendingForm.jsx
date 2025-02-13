import { useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";

export default function NewSendingForm({
  onSave,
  addMutation,
  selectedDocuments,
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
      alert("Veuillez sélectionner au moins un document.");
      return;
    }

    if (!formFields.name.trim()) {
      alert("Le nom est obligatoire.");
      return;
    }

    if (!formFields.date) {
      alert("La date est obligatoire.");
      return;
    }

    const formData = new FormData();
    formData.append("name", formFields.name);
    formData.append("date", formFields.date);
    formData.append("remarks", formFields.remarks);
    formData.append("documentIds", JSON.stringify(selectedDocuments));

    addMutation.mutate(formData, {
      onSuccess: onSave,
      onError: () => alert("Erreur lors de l'ajout de l'envoi."),
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
        <span className="text-gray-700">
          Nom <span className="text-red-500">*</span>
        </span>
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
