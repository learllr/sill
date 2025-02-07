import { File, FileImage, FileText } from "lucide-react";

export default function getFileIcon(filePath) {
  if (!filePath) return <File className="w-10 h-10 text-gray-500" />;

  const extension = filePath.split(".").pop().toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FileImage className="w-10 h-10 text-green-500 mx-auto" />;
    case "pdf":
      return <FileText className="w-10 h-10 text-red-500 mx-auto" />;
    case "doc":
    case "docx":
      return <FileText className="w-10 h-10 text-blue-500 mx-auto" />;
    default:
      return <File className="w-10 h-10 text-gray-500 mx-auto" />;
  }
}
