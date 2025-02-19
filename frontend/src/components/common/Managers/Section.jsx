import { ArrowLeft } from "lucide-react";

export default function Section({ title }) {
  return (
    <div className="flex items-center gap-2 border-b mb-6">
      <button onClick={() => window.history.back()} className="p-3">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
