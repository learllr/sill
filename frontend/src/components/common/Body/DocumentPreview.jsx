export default function DocumentPreview({ file }) {
  if (!file) return null;

  const previewUrl = URL.createObjectURL(file);
  const isImage = file.type.startsWith("image/");

  return (
    <div className="border p-2 rounded-md mt-2">
      {isImage ? (
        <img
          src={previewUrl}
          alt="Aperçu"
          className="w-full h-auto rounded-md"
        />
      ) : (
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-600"
        >
          Prévisualiser le document
        </a>
      )}
    </div>
  );
}
