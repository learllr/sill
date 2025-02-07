import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFSigner() {
  const [pdfFile, setPdfFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [position, setPosition] = useState(null);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    setPdfFile(URL.createObjectURL(event.target.files[0]));
  };

  const handleCanvasDraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    let drawing = false;

    const startDrawing = (e) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e) => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      drawing = false;
      setSignature(canvas.toDataURL());
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
  };

  const handlePDFClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

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
    saveAs(blob, "signed.pdf");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Signer un PDF</h1>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {pdfFile && (
        <div onClick={handlePDFClick} className="border">
          <Document file={pdfFile}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={200}
        height={100}
        className="border"
        onMouseDown={handleCanvasDraw}
      ></canvas>

      <button
        onClick={handleSignPDF}
        className="px-4 py-2 bg-blue-500 text-white"
      >
        Signer et télécharger
      </button>
    </div>
  );
}
