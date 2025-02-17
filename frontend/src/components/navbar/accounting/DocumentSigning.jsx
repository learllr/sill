import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/webpack";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../../axiosConfig.js";
import PDFSignerUI from "./PDFSignerUI.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DocumentSigning = () => {
  const location = useLocation();
  const initialFile = location.state?.document?.path || null;
  const initialId = location.state?.document?.id || null;
  const [file, setFile] = useState(initialFile);

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

        return new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            resolve({
              src: URL.createObjectURL(imageBlob),
              width: image.width,
              height: image.height,
            });
          };
          image.onerror = () => resolve(null);
          image.src = URL.createObjectURL(imageBlob);
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du logo :", error);
      return null;
    }
  };

  useEffect(() => {
    if (initialFile) {
      const fetchPdf = async () => {
        try {
          const response = await fetch(`${BASE_URL}/uploads/${initialFile}`);
          const blob = await response.blob();
          const file = new File([blob], "document.pdf", {
            type: "application/pdf",
          });
          setFile(file);
          loadPdf(file);

          const logoData = await fetchLogoPath();
          if (logoData) setPreviewLogo(logoData);
        } catch (error) {
          console.error("Erreur de chargement du PDF :", error);
        }
      };
      fetchPdf();
    }
  }, [initialFile]);

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

  const handleNewDocument = async () => {
    if (!modifiedPdfBytes || !initialFile) return;

    try {
      const formData = new FormData();
      const fileName = initialFile.split("/").pop();
      const newFile = new File([modifiedPdfBytes], fileName, {
        type: "application/pdf",
      });

      formData.append("file", newFile);

      const response = await axios.put(`/document/${initialId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        handleNewPdf();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du document :", error);
    }
  };

  return (
    <PDFSignerUI
      pdfDoc={pdfDoc}
      scale={scale}
      setScale={setScale}
      handleFileChange={handleFileChange}
      handlePrevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
      handleNextPage={() =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
      }
      currentPage={currentPage}
      totalPages={totalPages}
      handleCanvasClick={handleCanvasClick}
      previewLogo={previewLogo}
      signatures={signatures}
      signaturesApplied={signaturesApplied}
      handleUndo={handleUndo}
      applySignatures={applySignatures}
      handleDownload={handleDownload}
      handleNewPdf={handleNewPdf}
      initialFile={initialFile}
      handleNewDocument={handleNewDocument}
    />
  );
};

export default DocumentSigning;
