import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function InvoiceFields({
  register,
  errors,
  projects,
  participants,
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Titre <span className="text-red-500">*</span>
        </label>
        <Input {...register("title", { required: "Titre requis" })} />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de facture <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("invoiceNumber", {
            required: "Numéro de facture requis",
          })}
        />
        {errors.invoiceNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.invoiceNumber.message}
          </p>
        )}
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
          Lot
        </label>
        <Input
          {...register("lot")}
          placeholder="Numéro ou description du lot"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Payé le
        </label>
        <Input {...register("paidOn")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          {...register("description")}
          rows={3}
          placeholder="Description de la facture"
        />
      </div>
    </>
  );
}
