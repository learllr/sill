import { saveAs } from "file-saver";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/webpack";
import React, { useState } from "react";
import axios from "../../../axiosConfig.js";
import Section from "../../common/Managers/Section.jsx";
import PDFViewer from "./PDFViewer";
import ToolBar from "./ToolBar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DocumentSigning = () => {
  const [file, setFile] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [modifiedPdfBytes, setModifiedPdfBytes] = useState(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [signaturesApplied, setSignaturesApplied] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);

  const fetchLogoPath = async () => {
    try {
      const response = await axios.get("/signature");
      if (response.data?.filePath) {
        const logoPath = `${BASE_URL}/uploads/${response.data.filePath}`;
        const imageBlob = await fetch(logoPath).then((res) => res.blob());
        const image = new Image();

        return new Promise((resolve) => {
          image.onload = () => {
            resolve({
              src: URL.createObjectURL(imageBlob),
              width: image.width,
              height: image.height,
            });
          };
          image.src = URL.createObjectURL(imageBlob);
        });
      }
    } catch {
      return null;
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    loadPdf(selectedFile);
    const logoData = await fetchLogoPath();
    if (logoData) setPreviewLogo(logoData);
  };

  const loadPdf = async (file, pdfBytes = null) => {
    const typedarray = pdfBytes || new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjsLib.getDocument({ data: typedarray });
    const pdf = await loadingTask.promise;
    setPdfDoc(pdf);
    setTotalPages(pdf.numPages);
  };

  const handleCanvasClick = (position) => {
    setSignatures((prev) => [...prev, position]);
  };

  const handleUndo = () => {
    setSignatures((prev) => {
      const newSignatures = [...prev];
      const lastIndex = newSignatures.findLastIndex(
        (s) => s.page === currentPage
      );
      if (lastIndex !== -1) newSignatures.splice(lastIndex, 1);
      return newSignatures;
    });
  };

  const applySignatures = async () => {
    if (!file || !pdfDoc || !previewLogo) return;

    const pdfBytes = await file.arrayBuffer();
    const pdfDocInstance = await PDFDocument.load(pdfBytes);

    for (const { x, y, page, width, height } of signatures) {
      const pdfPage = pdfDocInstance.getPages()[page];
      if (!pdfPage) continue;

      const logoImage = await pdfDocInstance.embedJpg(
        await fetch(previewLogo.src).then((res) => res.arrayBuffer())
      );

      const pageHeight = pdfPage.getHeight();
      const correctedY = pageHeight - y - height;

      pdfPage.drawImage(logoImage, {
        x,
        y: correctedY,
        width,
        height,
      });
    }

    const finalPdfBytes = await pdfDocInstance.save();
    setModifiedPdfBytes(finalPdfBytes);
    loadPdfFromUrl(
      URL.createObjectURL(
        new Blob([finalPdfBytes], { type: "application/pdf" })
      )
    );
    setSignaturesApplied(true);
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

  const handleNewPdf = () => {
    setFile(null);
    setPdfDoc(null);
    setModifiedPdfBytes(null);
    setSignatures([]);
    setSignaturesApplied(false);
    setCurrentPage(0);
    setTotalPages(0);
    setScale(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

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
            <button
              onClick={handleNewPdf}
              className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition transform hover:scale-105"
            >
              Créer un nouveau PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentSigning;
