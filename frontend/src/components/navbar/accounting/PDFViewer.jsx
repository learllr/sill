import React, { useEffect, useRef, useState } from "react";

const PDFViewer = ({
  pdfDoc,
  onCanvasClick,
  previewLogo,
  scale,
  currentPage,
  signatures,
}) => {
  const pdfCanvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const imgRef = useRef(new Image());
  const [viewport, setViewport] = useState(null);
  const [previewPosition, setPreviewPosition] = useState(null);

  useEffect(() => {
    if (!pdfDoc) return;

    const renderPdf = async () => {
      const page = await pdfDoc.getPage(currentPage + 1);
      const newViewport = page.getViewport({ scale: 1 });
      setViewport(newViewport);

      const pdfCanvas = pdfCanvasRef.current;
      const pdfContext = pdfCanvas.getContext("2d");

      pdfCanvas.width = newViewport.width;
      pdfCanvas.height = newViewport.height;

      const renderContext = {
        canvasContext: pdfContext,
        viewport: newViewport,
      };
      await page.render(renderContext);

      const overlayCanvas = overlayCanvasRef.current;
      overlayCanvas.width = pdfCanvas.width;
      overlayCanvas.height = pdfCanvas.height;

      drawSignatures();
    };

    renderPdf();
  }, [pdfDoc, currentPage]);

  useEffect(() => {
    if (previewLogo && previewLogo.src) {
      imgRef.current.src = previewLogo.src;
      imgRef.current.onload = () => drawSignatures();
    }
  }, [previewLogo]);

  const handleMouseMove = (e) => {
    if (!overlayCanvasRef.current || !viewport) return;

    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const x =
      ((e.clientX - rect.left) / rect.width) * viewport.width -
      previewLogo.width / 2;
    const y =
      ((e.clientY - rect.top) / rect.height) * viewport.height -
      previewLogo.height / 2;

    setPreviewPosition({ x, y });
    drawSignatures();
  };

  const handleClick = (e) => {
    if (!overlayCanvasRef.current || !viewport) return;

    const rect = overlayCanvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * viewport.width;
    const y = ((e.clientY - rect.top) / rect.height) * viewport.height;

    onCanvasClick({
      x: x - previewLogo.width / 2,
      y: viewport.height - y - previewLogo.height / 2,
      page: currentPage,
      width: previewLogo.width,
      height: previewLogo.height,
    });

    setPreviewPosition(null);
  };

  const drawSignatures = () => {
    if (!overlayCanvasRef.current || !viewport) return;

    const overlayCanvas = overlayCanvasRef.current;
    const context = overlayCanvas.getContext("2d");
    context.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    const currentSignatures = signatures.filter(
      (sign) => sign.page === currentPage
    );

    currentSignatures.forEach(({ x, y, width, height }) => {
      context.globalAlpha = 1.0;
      context.drawImage(imgRef.current, x, y, width, height);
    });

    if (previewPosition) {
      context.globalAlpha = 0.5;
      context.drawImage(
        imgRef.current,
        previewPosition.x,
        previewPosition.y,
        previewLogo.width,
        previewLogo.height
      );
      context.globalAlpha = 1.0;
    }
  };

  useEffect(() => {
    drawSignatures();
  }, [signatures, previewPosition]);

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
