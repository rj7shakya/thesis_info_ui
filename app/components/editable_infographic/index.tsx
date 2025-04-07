"use client";

import React, { useState, useEffect, useRef } from "react";
import { parseNumberString } from "@/app/utils";
import {
  Canvas,
  Textbox,
  Path,
  Group,
  Text,
  Line,
  Image,
  Object as FabricObject,
} from "fabric";

interface EditableInfographicProps {
  data: {
    before?: string;
    number: string;
    after?: string;
    type?: string;
  };
  imageUrl?: string;
  type?: "pie" | "donut" | "bar" | "icon";
  quantity?: boolean;
}

const EditableInfographic: React.FC<EditableInfographicProps> = ({
  data,
  imageUrl,
  type,
  quantity,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  const numbers = parseNumberString(data.number);
  const total = numbers.reduce((a, b) => a + b, 0);

  const renderPieChart = (canvas: Canvas) => {
    const centerX = 600;
    const centerY = 300;
    const radius = 200;
    const innerRadius = type === "donut" ? 100 : 0;
    let startAngle = 0;

    const pieGroup = new Group([], {
      left: centerX,
      top: centerY,
      selectable: isEditing,
      hasControls: isEditing,
      hasBorders: isEditing,
      lockScalingX: false,
      lockScalingY: false,
      lockRotation: true,
      originX: "center",
      originY: "center",
    });

    numbers.forEach((value, index) => {
      const percentage = (value / total) * 100;
      const endAngle = startAngle + (percentage * Math.PI * 2) / 100;
      const midAngle = startAngle + (percentage * Math.PI) / 100;

      const x1 = radius * Math.cos(startAngle);
      const y1 = radius * Math.sin(startAngle);
      const x2 = radius * Math.cos(endAngle);
      const y2 = radius * Math.sin(endAngle);

      const innerX1 = innerRadius * Math.cos(startAngle);
      const innerY1 = innerRadius * Math.sin(startAngle);
      const innerX2 = innerRadius * Math.cos(endAngle);
      const innerY2 = innerRadius * Math.sin(endAngle);

      const largeArcFlag = percentage > 50 ? 1 : 0;
      const pathData = [
        "M",
        innerX1,
        innerY1,
        "L",
        x1,
        y1,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        1,
        x2,
        y2,
        "L",
        innerX2,
        innerY2,
        "A",
        innerRadius,
        innerRadius,
        0,
        largeArcFlag,
        0,
        innerX1,
        innerY1,
        "Z",
      ].join(" ");

      const path = new Path(pathData, {
        fill: `hsl(${(index * 360) / numbers.length}, 70%, 50%)`,
        stroke: "#ffffff",
        strokeWidth: 2,
        selectable: isEditing,
        hasControls: isEditing,
        hasBorders: isEditing,
        data: { index },
      });

      pieGroup.add(path);

      // Add label and arrow if label exists
      const labelRadius = radius + 40;
      const labelX = labelRadius * Math.cos(midAngle);
      const labelY = labelRadius * Math.sin(midAngle);

      // Create arrow line
      const arrowStartX = (radius + 10) * Math.cos(midAngle);
      const arrowStartY = (radius + 10) * Math.sin(midAngle);
      const arrowEndX = (labelRadius - 10) * Math.cos(midAngle);
      const arrowEndY = (labelRadius - 10) * Math.sin(midAngle);

      const arrow = new Line([arrowStartX, arrowStartY, arrowEndX, arrowEndY], {
        stroke: `hsl(${(index * 360) / numbers.length}, 70%, 50%)`,
        strokeWidth: 2,
        selectable: false,
      });

      // Create label text
      const label = new Text(`${((value / total) * 100).toFixed(1)}%`, {
        left: labelX + (labelX > 0 ? 10 : -30),
        top: labelY + (labelY > 0 ? 10 : -10),
        fontSize: 16,
        fill: `hsl(${(index * 360) / numbers.length}, 70%, 50%)`,
        fontWeight: "bold",
        selectable: false,
        backgroundColor: "#ffffff",
        padding: 4,
        textAlign: "center",
        originX: "center",
        originY: "center",
      });

      pieGroup.add(arrow, label);
      startAngle = endAngle;
    });

    canvas.add(pieGroup);
  };

  const loadImage = (canvas: Canvas) => {
    console.log("imageUrl", imageUrl);
    if (imageUrl) {
      // Add crossOrigin option for hosted images
      Image.fromURL(
        imageUrl,
        ((img: any) => {
          if (!img) return;
          console.log("img", img);
          // Scale image to fit within 200x200 while maintaining aspect ratio
          const maxSize = 200;
          const scale = Math.min(
            maxSize / (img.width || 1),
            maxSize / (img.height || 1)
          );

          img.scale(scale);

          // Position image in the center of the canvas
          img.set({
            left: 400,
            top: 300,
            originX: "center",
            originY: "center",
            selectable: isEditing,
            hasControls: isEditing,
            hasBorders: isEditing,
          });

          canvas.add(img);
          canvas.renderAll();
        }) as any,
        {
          crossOrigin: "anonymous", // Enable CORS for hosted images
        }
      );
    }
  };

  // Initialize canvas and add content
  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#f8f9fa",
        selection: true,
      });
      fabricRef.current = canvas;

      // Add before text if exists
      if (data.before) {
        const beforeText = new Textbox(data.before, {
          left: 50,
          top: 50,
          fontSize: 24,
          fontFamily: "Arial",
          width: 500,
          selectable: isEditing,
          hasControls: isEditing,
          hasBorders: isEditing,
        });
        canvas.add(beforeText);
      }

      // Add number text
      const numberText = new Textbox(data.number, {
        left: 50,
        top: 100,
        fontSize: 48,
        fontFamily: "Arial",
        fontWeight: "bold",
        width: 500,
        selectable: isEditing,
        hasControls: isEditing,
        hasBorders: isEditing,
      });
      canvas.add(numberText);

      // Add after text if exists
      if (data.after) {
        const afterText = new Textbox(data.after, {
          left: 50,
          top: 170,
          fontSize: 24,
          fontFamily: "Arial",
          width: 500,
          selectable: isEditing,
          hasControls: isEditing,
          hasBorders: isEditing,
        });
        canvas.add(afterText);
      }

      // Add pie chart if type is pie or donut
      if (type === "pie" || type === "donut") {
        renderPieChart(canvas);
      }

      // Load image if provided
      loadImage(canvas);

      canvas.renderAll();
    }

    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, [data.before, data.number, data.after, type, imageUrl]);

  // Update editing state
  useEffect(() => {
    if (fabricRef.current) {
      const canvas = fabricRef.current;
      canvas.selection = isEditing;

      canvas.forEachObject((obj: FabricObject) => {
        obj.selectable = isEditing;
        obj.hasControls = isEditing;
        obj.hasBorders = isEditing;
      });

      canvas.renderAll();
    }
  }, [isEditing]);

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "infographic.png";
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-lg"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableInfographic;
