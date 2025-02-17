import { Trash2 } from "lucide-react";
import IconButton from "../../Design/Buttons/IconButton";

export default function EditContactPersons({
  contactPersons,
  formData,
  setFormData,
}) {
  const handleAddPerson = () => {
    const newPerson = { name: "", phone: "", email: "" };
    setFormData((prevData) => ({
      ...prevData,
      contactPersons: [...prevData.contactPersons, newPerson],
    }));
  };

  const handleChangePerson = (index, e) => {
    const { name, value } = e.target;
    const updatedContactPersons = [...contactPersons];
    updatedContactPersons[index] = {
      ...updatedContactPersons[index],
      [name]: value,
    };

    setFormData((prevData) => ({
      ...prevData,
      contactPersons: updatedContactPersons,
    }));
  };

  const handleDeletePerson = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      contactPersons: prevData.contactPersons.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-3">
      {contactPersons.map((person, index) => (
        <div key={index} className="border p-4 rounded-lg bg-white ">
          <div className="flex space-x-2 items-center justify-center ">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                name="name"
                value={person.name}
                onChange={(e) => handleChangePerson(index, e)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                placeholder="Nom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="text"
                name="phone"
                value={person.phone}
                onChange={(e) => handleChangePerson(index, e)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                placeholder="Téléphone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={person.email}
                onChange={(e) => handleChangePerson(index, e)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
                placeholder="Email"
              />
            </div>
            <div>
              <IconButton
                onClick={() => handleDeletePerson(index)}
                variant="red"
                className="mt-5"
              >
                <Trash2 />
              </IconButton>
            </div>
          </div>
        </div>
      ))}
      <IconButton
        onClick={handleAddPerson}
        variant="green"
        className="px-5 flex items-center mx-auto"
      >
        Ajouter un interlocuteur
      </IconButton>
    </div>
  );
}
