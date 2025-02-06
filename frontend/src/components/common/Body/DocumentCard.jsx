import getFileIcon from "../../../../../shared/utils/getFileIcon.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function DocumentCard({ document, onSelectItem }) {
  return (
    <div
      className="border p-3 rounded-lg text-center w-[180px] flex-shrink-0 hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer"
      onClick={() => onSelectItem(document)}
    >
      {getFileIcon(document.path)}
      <p className="mt-2">
        {document.year} - {document.month}
      </p>
    </div>
  );
}
