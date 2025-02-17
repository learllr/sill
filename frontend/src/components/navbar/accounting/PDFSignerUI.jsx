import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Section from "../../common/Managers/Section.jsx";
import ConfirmDialog from "../../dialogs/ConfirmDialog.jsx";
import PDFViewer from "./PDFViewer";
import ToolBar from "./ToolBar";

export default function PDFSignerUI({
  pdfDoc,
  scale,
  setScale,
  handleFileChange,
  handlePrevPage,
  handleNextPage,
  currentPage,
  totalPages,
  handleCanvasClick,
  previewLogo,
  signatures,
  signaturesApplied,
  handleUndo,
  applySignatures,
  handleDownload,
  handleNewPdf,
  initialFile,
  handleNewDocument,
}) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  return (
    <div>
      <Section title="Signer un document" />
      <div className="flex flex-col items-center min-h-screen mb-6">
        {!pdfDoc && (
          <label className="cursor-pointer flex flex-col items-center bg-white border-2 border-dashed border-gray-300 rounded-lg p-5 w-80 hover:border-blue-500 transition">
            <span className="text-gray-600 font-medium">
              Sélectionner un fichier PDF
            </span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}

        {pdfDoc && <ToolBar scale={scale} setScale={setScale} />}

        {pdfDoc && (
          <div className="flex items-center justify-center space-x-4 w-full mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
            >
              <ChevronLeft />
            </button>

            <PDFViewer
              pdfDoc={pdfDoc}
              scale={scale}
              onCanvasClick={handleCanvasClick}
              previewLogo={previewLogo}
              currentPage={currentPage}
              signatures={signatures}
              signaturesApplied={signaturesApplied}
            />

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
            >
              <ChevronRight />
            </button>
          </div>
        )}

        {pdfDoc && (
          <div className="mt-4 text-gray-700 font-medium">
            Page {currentPage + 1} / {totalPages}
          </div>
        )}

        {pdfDoc && !signaturesApplied && (
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleUndo}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Annuler
            </button>
            <button
              onClick={applySignatures}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Appliquer les signatures
            </button>
          </div>
        )}

        {pdfDoc && signaturesApplied && (
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleDownload}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              Télécharger le PDF signé
            </button>
            {initialFile ? (
              <button
                onClick={() => setIsConfirmDialogOpen(true)}
                className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
              >
                Écraser le document avec celui avec la signature
              </button>
            ) : (
              <button
                onClick={handleNewPdf}
                className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
              >
                Créer un nouveau PDF
              </button>
            )}
          </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => {
          handleNewDocument();
          setIsConfirmDialogOpen(false);
        }}
        title="Confirmer l'écrasement"
        message="Êtes-vous sûr de vouloir écraser ce document avec la version signée ? Cette action est irréversible."
        confirmText="Confirmer"
        cancelText="Annuler"
      />
    </div>
  );
}
