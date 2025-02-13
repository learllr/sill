import React, { useEffect, useRef, useState } from "react";

const PDFViewer = ({ pdfDoc, onCanvasClick, previewLogo, scale }) => {
  const pdfCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const imgRef = useRef(null);

  const [logoPosition, setLogoPosition] = useState(null);

  useEffect(() => {
    if (!pdfDoc) return;

    const renderPdf = async () => {
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const pdfCanvas = pdfCanvasRef.current;
      const pdfContext = pdfCanvas.getContext("2d");

      pdfCanvas.width = viewport.width;
      pdfCanvas.height = viewport.height;

      const renderContext = {
        canvasContext: pdfContext,
        viewport: viewport,
      };
      await page.render(renderContext);

      const overlayCanvas = overlayCanvasRef.current;
      overlayCanvas.width = pdfCanvas.width;
      overlayCanvas.height = pdfCanvas.height;
    };

    renderPdf();
  }, [pdfDoc]);

  useEffect(() => {
    if (previewLogo && previewLogo.src) {
      const img = new Image();
      img.src = previewLogo.src;
      img.onload = () => {
        imgRef.current = img;
      };
    }
  }, [previewLogo]);

  useEffect(() => {
    if (previewLogo) {
      setLogoPosition({
        ...previewLogo,
        width: previewLogo.width * scale, // Appliquer l'échelle
        height: previewLogo.height * scale, // Appliquer l'échelle
      });
    }
  }, [previewLogo, scale]); // Ajout de `scale` dans les dépendances

  const handleMouseMove = (e) => {
    if (!previewLogo || !imgRef.current) return;

    const overlayCanvas = overlayCanvasRef.current;
    const context = overlayCanvas.getContext("2d");
    const rect = overlayCanvas.getBoundingClientRect();

    const x = e.clientX - rect.left - (previewLogo.width * scale) / 2;
    const y = e.clientY - rect.top - (previewLogo.height * scale) / 2;

    setLogoPosition({
      ...previewLogo,
      x,
      y,
    });

    context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    context.globalAlpha = 0.5;
    context.drawImage(
      imgRef.current,
      x,
      y,
      previewLogo.width * scale, // Appliquer l'échelle ici
      previewLogo.height * scale // Appliquer l'échelle ici
    );
    context.globalAlpha = 1.0;
  };

  const handleClick = (e) => {
    if (!onCanvasClick) return;
    onCanvasClick(e);
  };

  return (
    <div className="relative flex flex-col items-center">
      <canvas
        ref={pdfCanvasRef}
        className="border border-gray-300 shadow-md rounded-md"
      />
      <canvas
        ref={overlayCanvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="absolute top-0 left-0 cursor-crosshair"
      />
    </div>
  );
};

export default PDFViewer;
