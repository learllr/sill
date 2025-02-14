import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/webpack";
import React, { useState } from "react";
import PDFViewer from "./PDFViewer";
import ToolBar from "./ToolBar";

const DocumentSigning = () => {
  const LOGO_PATH = "/logos/logo-entreprise.jpg";
  const BASE_LOGO_WIDTH = 100;
  const BASE_LOGO_HEIGHT = 50;

  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [modifiedPdfBytes, setModifiedPdfBytes] = useState(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [previewLogo, setPreviewLogo] = useState({
    width: BASE_LOGO_WIDTH,
    height: BASE_LOGO_HEIGHT,
    src: LOGO_PATH,
  });

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    loadPdf(selectedFile);
  };

  const loadPdf = async (file, pdfBytes = null) => {
    const typedarray = pdfBytes || new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjsLib.getDocument({ data: typedarray });
    const pdf = await loadingTask.promise;
    setPdfDoc(pdf);
  };

  const handleCanvasClick = (position) => {
    setSignatures((prev) => [...prev, position]);
  };

  const handleUndo = () => {
    setSignatures((prev) => prev.slice(0, -1));
  };

  const applySignatures = async () => {
    if (!file || !pdfDoc) return;
    const pdfBytes = await file.arrayBuffer();
    const pdfDocInstance = await PDFDocument.load(pdfBytes);

    for (const { x, y, page, width, height } of signatures) {
      const pdfPage = pdfDocInstance.getPages()[page];
      if (!pdfPage) continue;

      const response = await fetch(LOGO_PATH);
      if (!response.ok) continue;
      const logoImage = await pdfDocInstance.embedJpg(
        await response.arrayBuffer()
      );

      pdfPage.drawImage(logoImage, { x, y, width, height });
    }

    const finalPdfBytes = await pdfDocInstance.save();
    setModifiedPdfBytes(finalPdfBytes);
    loadPdfFromUrl(
      URL.createObjectURL(
        new Blob([finalPdfBytes], { type: "application/pdf" })
      )
    );
  };

  const loadPdfFromUrl = async (pdfUrl) => {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    setPdfDoc(await loadingTask.promise);
  };

  const handleDownload = () => {
    if (!modifiedPdfBytes || !file) return;
    const fileName = file.name.replace(/\.pdf$/, "") + "_signé.pdf";
    saveAs(new Blob([modifiedPdfBytes], { type: "application/pdf" }), fileName);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        ✍️ Signer un PDF
      </h2>
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

      <ToolBar scale={scale} setScale={setScale} />

      {pdfDoc && (
        <div className="flex flex-col items-center space-y-6 w-full mt-6">
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              ◀️ Précédent
            </button>
            <span>
              Page {currentPage + 1} / {pdfDoc.numPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pdfDoc.numPages - 1)
                )
              }
              disabled={currentPage === pdfDoc.numPages - 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Suivant ▶️
            </button>
          </div>

          <PDFViewer
            pdfDoc={pdfDoc}
            scale={scale}
            onCanvasClick={handleCanvasClick}
            previewLogo={previewLogo}
            currentPage={currentPage}
            signatures={signatures}
          />

          <div className="flex space-x-4">
            <button
              onClick={handleUndo}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            >
              ⬅️ Annuler
            </button>
            <button
              onClick={applySignatures}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              ✅ Appliquer les signatures
            </button>
          </div>

          {modifiedPdfBytes && (
            <button
              onClick={handleDownload}
              className="mt-4 px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105"
            >
              📄 Télécharger le PDF signé
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentSigning;
