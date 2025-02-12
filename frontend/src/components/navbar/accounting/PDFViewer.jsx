import React, { useEffect, useRef, useState } from "react";

const PDFViewer = ({ pdfDoc, onCanvasClick, previewLogo }) => {
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
        width: previewLogo.width,
        height: previewLogo.height,
      });
    }
  }, [previewLogo]);

  const handleMouseMove = (e) => {
    if (!previewLogo || !imgRef.current) return;

    const overlayCanvas = overlayCanvasRef.current;
    const context = overlayCanvas.getContext("2d");
    const rect = overlayCanvas.getBoundingClientRect();

    const x = e.clientX - rect.left - previewLogo.width / 2;
    const y = e.clientY - rect.top - previewLogo.height / 2;

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
      previewLogo.width,
      previewLogo.height
    );
    context.globalAlpha = 1.0;
  };

  const handleClick = (e) => {
    if (!onCanvasClick) return;
    onCanvasClick(e);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <canvas ref={pdfCanvasRef} style={{ border: "1px solid black" }} />
      <canvas
        ref={overlayCanvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          cursor: "crosshair",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
};

export default PDFViewer;
