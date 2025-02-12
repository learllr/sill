import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFViewer({ pdfFile }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (!pdfFile) return null;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Conteneur avec affichage de 1 seule page */}
      <div
        className="border border-gray-300 flex justify-center"
        style={{
          overflowY: "auto",
        }}
      >
        <Document
          file={pdfFile}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Page pageNumber={currentPage} />
        </Document>
      </div>

      {/* Contrôles de navigation (invisibles si 1 seule page) */}
      <div className="flex space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 disabled:opacity-50"
        >
          Précédent
        </button>
        <span>
          Page {currentPage} / {numPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages))}
          disabled={currentPage === numPages}
          className="px-4 py-2 bg-gray-300 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
