import FileInfo from "./FileInfo";
import FilePreview from "./FilePreview";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function FileDisplay({ file }) {
  if (!file) {
    return <div className="text-gray-500">Aucun document.</div>;
  }

  return (
    <div className="relative max-w-sm mx-auto">
      <a
        href={`${BASE_URL}/uploads/${file.fileName}`}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="w-96 h-56 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 shadow-md"
      >
        <FilePreview fileName={file.fileName} />
      </a>

      <FileInfo title={file.title} />
    </div>
  );
}
