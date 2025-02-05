import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function QuoteFormFields({
  register,
  errors,
  projects,
  participants,
  watch,
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titre <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("title", { required: "Titre requis" })}
          placeholder="Titre du devis"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de devis <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("quoteNumber", { required: "Numéro requis" })}
          placeholder="Numéro du devis"
        />
        {errors.quoteNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.quoteNumber.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lien de l'image
        </label>
        <Input {...register("imagePath")} placeholder="URL de l'image" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Projet
        </label>
        <select
          {...register("projectId")}
          className="w-full border p-2 rounded"
          defaultValue=""
        >
          <option value="" disabled hidden>
            -- Sélectionner un projet --
          </option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Participant
        </label>
        <select
          {...register("participantId")}
          className="w-full border p-2 rounded"
          defaultValue=""
        >
          <option value="" disabled hidden>
            -- Sélectionner un participant --
          </option>
          {participants?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Lot
        </label>
        <Input
          {...register("lot")}
          placeholder="Numéro ou description du lot"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Statut
        </label>
        <select
          {...register("status")}
          className="w-full border p-2 rounded"
          defaultValue=""
        >
          <option value="" disabled hidden>
            -- Sélectionner --
          </option>
          <option value="En attente">En attente</option>
          <option value="Accepté">Accepté</option>
          <option value="Rejeté">Rejeté</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Envoyé le
        </label>
        <Input {...register("sentOn")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Remarques
        </label>
        <Textarea
          {...register("remarks")}
          rows={3}
          placeholder="Ajoutez des remarques"
        />
      </div>
    </>
  );
}
