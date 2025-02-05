import React from "react";
import { Input } from "@/components/ui/input";

export default function EmployeeFormFields({ register, errors }) {
  return (
    <>
      {/* Informations personnelles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prénom <span className="text-red-500">*</span>
        </label>
        <Input {...register("firstName", { required: "Prénom requis" })} />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom <span className="text-red-500">*</span>
        </label>
        <Input {...register("lastName", { required: "Nom requis" })} />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de naissance
        </label>
        <Input {...register("birthDate")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ville de naissance
        </label>
        <Input {...register("birthCity")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nationalité
        </label>
        <Input {...register("nationality")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Statut familial
        </label>
        <select
          {...register("familyStatus")}
          className="w-full border p-2 rounded"
          defaultValue=""
        >
          <option value="" disabled hidden>
            -- Sélectionner --
          </option>
          <option value="Célibataire">Célibataire</option>
          <option value="Marié">Marié</option>
          <option value="Vie maritale">Vie maritale</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enfants à charge
        </label>
        <Input {...register("dependentChildren")} type="number" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de Sécurité Sociale
        </label>
        <Input {...register("socialSecurityNumber")} />
      </div>

      {/* Coordonnées */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <Input {...register("address")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Code postal
        </label>
        <Input {...register("postalCode")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ville
        </label>
        <Input {...register("city")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Téléphone
        </label>
        <Input {...register("phone")} type="tel" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          {...register("email", {
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email invalide",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Informations professionnelles */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Poste
        </label>
        <Input {...register("jobTitle")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Qualification
        </label>
        <Input {...register("qualification")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type de contrat
        </label>
        <select
          {...register("contractType")}
          className="w-full border p-2 rounded"
          defaultValue=""
        >
          <option value="" disabled hidden>
            -- Sélectionner --
          </option>
          <option value="CDD">CDD</option>
          <option value="CDI">CDI</option>
          <option value="Contrat d'apprentissage">
            Contrat d'apprentissage
          </option>
          <option value="Contrat de professionnalisation">
            Contrat de professionnalisation
          </option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Durée du contrat (mois)
        </label>
        <Input {...register("contractDurationMonths")} type="number" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Temps de travail
        </label>
        <select
          {...register("workTime")}
          className="w-full border p-2 rounded"
          defaultValue=""
        >
          <option value="" disabled hidden>
            -- Sélectionner --
          </option>
          <option value="Temps plein">Temps plein</option>
          <option value="Temps partiel">Temps partiel</option>
          <option value="Mi-temps">Mi-temps</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Salaire net mensuel
        </label>
        <Input {...register("monthlyNetSalary")} type="number" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Heures par semaine
        </label>
        <Input {...register("weeklyHours")} type="number" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de début
        </label>
        <Input {...register("startDate")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de fin
        </label>
        <Input {...register("endDate")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Carte BTP
        </label>
        <input {...register("btpCard")} type="checkbox" className="ml-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date de visite médicale
        </label>
        <Input {...register("medicalCheckupDate")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Actif
        </label>
        <input {...register("active")} type="checkbox" className="ml-2" />
      </div>
    </>
  );
}
