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
  const [previewLogo, setPreviewLogo] = useState({
    x: 0,
    y: 0,
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

  const updatePreviewPosition = (event, canvas) => {
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setPreviewLogo({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      width: BASE_LOGO_WIDTH * scale,
      height: BASE_LOGO_HEIGHT * scale,
      src: LOGO_PATH,
    });
  };

  const handleCanvasClick = async (event) => {
    if (!file || !pdfDoc) return;

    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - (BASE_LOGO_WIDTH * scale) / 2;
    const y =
      rect.height - (event.clientY - rect.top) - (BASE_LOGO_HEIGHT * scale) / 2;

    const modifiedPdfBytes = await modifyPdf(
      file,
      x,
      y,
      rect.width,
      rect.height
    );
    if (!modifiedPdfBytes) return;

    setModifiedPdfBytes(modifiedPdfBytes);

    const pdfBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    loadPdfFromUrl(URL.createObjectURL(pdfBlob));
  };

  const modifyPdf = async (file, x, y, canvasWidth, canvasHeight) => {
    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const firstPage = pdfDoc.getPages()[0];
      if (!firstPage) return null;

      const { width, height } = firstPage.getSize();
      const pdfX = (x / canvasWidth) * width;
      const pdfY = (y / canvasHeight) * height;

      const response = await fetch(LOGO_PATH);
      if (!response.ok) return null;

      const logoImage = await pdfDoc.embedJpg(await response.arrayBuffer());
      firstPage.drawImage(logoImage, {
        x: pdfX,
        y: pdfY,
        width: BASE_LOGO_WIDTH * scale,
        height: BASE_LOGO_HEIGHT * scale,
      });

      return await pdfDoc.save();
    } catch {
      return null;
    }
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
          <PDFViewer
            pdfDoc={pdfDoc}
            scale={scale}
            onCanvasClick={handleCanvasClick}
            previewLogo={
              previewLogo && {
                ...previewLogo,
                updatePosition: updatePreviewPosition,
              }
            }
          />
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
