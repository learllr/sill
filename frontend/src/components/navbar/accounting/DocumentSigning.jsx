import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import { useState } from "react";
import PDFViewer from "./PDFViewer";

export default function DocumentSigning() {
  const [pdfFile, setPdfFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [position, setPosition] = useState(null);

  // Gestion du chargement du fichier PDF
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(URL.createObjectURL(file));
    }
  };

  // Gestion du clic sur le PDF pour placer la signature
  const handlePDFClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  // Ajout de la signature au PDF et téléchargement
  const handleSignPDF = async () => {
    if (!pdfFile || !signature || !position) return;

    const existingPdfBytes = await fetch(pdfFile).then((res) =>
      res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const firstPage = pdfDoc.getPages()[0];

    const img = await pdfDoc.embedPng(signature);
    const { width, height } = firstPage.getSize();

    firstPage.drawImage(img, {
      x: position.x,
      y: height - position.y,
      width: 100,
      height: 50,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "signed-document.pdf");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Signer un document PDF</h1>

      {/* Importation du fichier PDF */}
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {/* Aperçu du PDF */}
      <PDFViewer pdfFile={pdfFile} onPDFClick={handlePDFClick} />

      {/* Canvas pour dessiner la signature */}
      {/* <SignatureCanvas onSignature={setSignature} /> */}

      {/* Bouton pour signer et télécharger */}
      <button
        onClick={handleSignPDF}
        className="px-4 py-2 bg-blue-500 text-white"
      >
        Signer et télécharger
      </button>
    </div>
  );
}
