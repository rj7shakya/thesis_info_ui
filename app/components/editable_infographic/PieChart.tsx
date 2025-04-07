import React, { useEffect, useRef, useState } from "react";
import {
  Canvas,
  Path,
  Group,
  Text,
  Line,
  Object as FabricObject,
} from "fabric";

interface PieChartProps {
  data: { value: number; color: string; label?: string }[];
  width?: number;
  height?: number;
  isEditing?: boolean;
  onColorChange?: (index: number, color: string) => void;
  onSizeChange?: (size: number) => void;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 200,
  height = 200,
  isEditing = false,
  onColorChange,
  onSizeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#f8f9fa",
        selection: true,
        preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      const total = data.reduce((sum, item) => sum + item.value, 0);
      let startAngle = 0;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 10;

      const pieGroup = new Group([], {
        left: centerX,
        top: centerY,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: true,
        originX: "center",
        originY: "center",
      });

      data.forEach((item, index) => {
        const percentage = (item.value / total) * 100;
        const endAngle = startAngle + (percentage * Math.PI * 2) / 100;
        const midAngle = startAngle + (percentage * Math.PI) / 100;

        // Create pie segment path
        const x1 = radius * Math.cos(startAngle);
        const y1 = radius * Math.sin(startAngle);
        const x2 = radius * Math.cos(endAngle);
        const y2 = radius * Math.sin(endAngle);

        const largeArcFlag = percentage > 50 ? 1 : 0;
        const pathData = [
          "M",
          0,
          0,
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
          "Z",
        ].join(" ");

        const path = new Path(pathData, {
          fill: item.color,
          stroke: "#ffffff",
          strokeWidth: 2,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          data: { index },
        });

        path.on("mousedown", () => {
          if (isEditing) {
            setSelectedSlice(index);
            onColorChange?.(index, item.color);
          }
        });

        pieGroup.add(path);

        // Add label and arrow if label exists
        if (item.label) {
          const labelRadius = radius + 40;
          const labelX = labelRadius * Math.cos(midAngle);
          const labelY = labelRadius * Math.sin(midAngle);

          // Create arrow line
          const arrowStartX = (radius + 10) * Math.cos(midAngle);
          const arrowStartY = (radius + 10) * Math.sin(midAngle);
          const arrowEndX = (labelRadius - 10) * Math.cos(midAngle);
          const arrowEndY = (labelRadius - 10) * Math.sin(midAngle);

          const arrow = new Line(
            [arrowStartX, arrowStartY, arrowEndX, arrowEndY],
            {
              stroke: item.color,
              strokeWidth: 2,
              selectable: false,
            }
          );

          // Create label text
          const label = new Text(item.label, {
            left: labelX + (labelX > 0 ? 10 : -30),
            top: labelY + (labelY > 0 ? 10 : -10),
            fontSize: 16,
            fill: item.color,
            fontWeight: "bold",
            selectable: false,
            backgroundColor: "#ffffff",
            padding: 4,
            textAlign: "center",
            originX: "center",
            originY: "center",
          });

          pieGroup.add(arrow, label);
        }

        startAngle = endAngle;
      });

      pieGroup.on("scaling", () => {
        const scale = pieGroup.scaleX || 1;
        onSizeChange?.(radius * scale);
      });

      canvas.add(pieGroup);
      canvas.renderAll();
    }

    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
    };
  }, [data, width, height]);

  // Update editing state
  useEffect(() => {
    if (fabricRef.current) {
      const canvas = fabricRef.current;
      canvas.selection = isEditing;

      canvas.forEachObject((obj) => {
        obj.selectable = isEditing;
        obj.hasControls = isEditing;
        obj.hasBorders = isEditing;
      });

      canvas.renderAll();
    }
  }, [isEditing]);

  return (
    <div className="border-2 border-gray-300 rounded-lg">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default PieChart;
