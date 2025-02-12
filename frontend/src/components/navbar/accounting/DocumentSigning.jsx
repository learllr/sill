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
    const logoWidth = BASE_LOGO_WIDTH * scale;
    const logoHeight = BASE_LOGO_HEIGHT * scale;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setPreviewLogo({
      x,
      y,
      width: logoWidth,
      height: logoHeight,
      src: LOGO_PATH,
    });
  };

  const handleCanvasClick = async (event) => {
    if (!file || !pdfDoc) return;

    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const logoWidth = BASE_LOGO_WIDTH * scale;
    const logoHeight = BASE_LOGO_HEIGHT * scale;
    const x = event.clientX - rect.left - logoWidth / 2;
    const y = rect.height - (event.clientY - rect.top) - logoHeight / 2;

    const modifiedPdfBytes = await modifyPdf(
      file,
      x,
      y,
      rect.width,
      rect.height,
      logoWidth,
      logoHeight
    );
    setModifiedPdfBytes(modifiedPdfBytes);
    setPreviewLogo(null);
    loadPdf(file, modifiedPdfBytes);
  };

  const modifyPdf = async (
    file,
    x,
    y,
    canvasWidth,
    canvasHeight,
    logoWidth,
    logoHeight
  ) => {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const firstPage = pdfDoc.getPages()[0];
    const { width, height } = firstPage.getSize();

    const pdfX = (x / canvasWidth) * width;
    const pdfY = (y / canvasHeight) * height;

    const logoImageBytes = await fetch(LOGO_PATH).then((res) =>
      res.arrayBuffer()
    );
    const logoImage = await pdfDoc.embedJpg(logoImageBytes);

    firstPage.drawImage(logoImage, {
      x: pdfX,
      y: pdfY,
      width: logoWidth,
      height: logoHeight,
    });

    return await pdfDoc.save();
  };

  const handleDownload = () => {
    if (!modifiedPdfBytes) return;
    const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    saveAs(blob, "signed.pdf");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Signer un PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      <ToolBar scale={scale} setScale={setScale} />

      {pdfDoc && (
        <PDFViewer
          pdfDoc={pdfDoc}
          onCanvasClick={handleCanvasClick}
          previewLogo={
            previewLogo
              ? {
                  ...previewLogo,
                  width: BASE_LOGO_WIDTH * scale,
                  height: BASE_LOGO_HEIGHT * scale,
                  updatePosition: updatePreviewPosition,
                }
              : null
          }
        />
      )}

      <p>Cliquez sur le PDF pour ajouter le logo</p>
      {modifiedPdfBytes && (
        <button onClick={handleDownload}>Télécharger le PDF signé</button>
      )}
    </div>
  );
};

export default DocumentSigning;
