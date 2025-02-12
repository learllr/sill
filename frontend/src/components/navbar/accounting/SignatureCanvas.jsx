import { useEffect, useRef, useState } from "react";

export default function SignatureCanvas({ onSignature }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    const startDrawing = (e) => {
      setDrawing(true);
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e) => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setDrawing(false);
      onSignature(canvas.toDataURL());
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
    };
  }, [drawing, onSignature]);

  return <canvas ref={canvasRef} width={200} height={100} className="border" />;
}
