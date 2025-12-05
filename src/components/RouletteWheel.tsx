import { useEffect, useRef, useState } from "react";
import { Participant } from "@/types/participant";

interface RouletteWheelProps {
  participants: Participant[];
  isSpinning: boolean;
  targetParticipant: Participant | null;
  onSpinComplete: () => void;
  onTick: () => void;
}

const WHEEL_COLORS = [
  "hsl(352, 83%, 55%)",
  "hsl(258, 90%, 66%)",
  "hsl(199, 95%, 50%)",
  "hsl(162, 94%, 44%)",
  "hsl(45, 100%, 51%)",
  "hsl(24, 100%, 55%)",
  "hsl(280, 85%, 65%)",
  "hsl(180, 82%, 45%)",
];

export function RouletteWheel({
  participants,
  isSpinning,
  targetParticipant,
  onSpinComplete,
  onTick,
}: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);

  const totalEntries = participants.reduce((sum, p) => sum + p.entries, 0);

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    if (participants.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.fillStyle = "hsl(0, 0%, 96%)";
      ctx.fill();
      ctx.strokeStyle = "hsl(0, 0%, 0%)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "hsl(0, 0%, 45%)";
      ctx.font = "bold 14px 'Space Grotesk'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Adicione participantes", center, center);
      return;
    }

    let startAngle = (rotation * Math.PI) / 180;

    participants.forEach((participant, index) => {
      const sliceAngle = (participant.entries / totalEntries) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = WHEEL_COLORS[index % WHEEL_COLORS.length];
      ctx.fill();

      ctx.strokeStyle = "hsl(0, 0%, 0%)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      const textAngle = startAngle + sliceAngle / 2;
      const textRadius = radius * 0.65;
      const textX = center + Math.cos(textAngle) * textRadius;
      const textY = center + Math.sin(textAngle) * textRadius;

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);

      ctx.fillStyle = "hsl(0, 0%, 100%)";
      ctx.strokeStyle = "hsl(0, 0%, 0%)";
      ctx.lineWidth = 3;
      ctx.font = "bold 12px 'Space Grotesk'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const displayName =
        participant.name.length > 10
          ? participant.name.substring(0, 10) + "..."
          : participant.name;

      ctx.strokeText(displayName, 0, 0);
      ctx.fillText(displayName, 0, 0);
      ctx.restore();

      startAngle = endAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(center, center, 20, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(0, 0%, 100%)";
    ctx.fill();
    ctx.strokeStyle = "hsl(0, 0%, 0%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw outer ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "hsl(0, 0%, 0%)";
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [participants, rotation, totalEntries]);

  // Spinning animation
  useEffect(() => {
    if (!isSpinning || !targetParticipant || participants.length === 0) return;

    // Calculate target angle
    let cumulativeAngle = 0;
    for (const p of participants) {
      const sliceAngle = (p.entries / totalEntries) * 360;
      if (p.id === targetParticipant.id) {
        cumulativeAngle += sliceAngle / 2;
        break;
      }
      cumulativeAngle += sliceAngle;
    }

    // Target: pointer is at top (270deg), so we need to rotate the wheel
    // to put the target segment at the top
    const targetRotation = 360 * 5 + (270 - cumulativeAngle);
    const startRotation = rotation;
    const startTime = performance.now();
    const duration = 4000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRotation =
        startRotation + (targetRotation - startRotation) * eased;

      setRotation(currentRotation % 360);

      // Play tick sound at intervals
      const tickInterval = Math.max(50, 200 * progress);
      if (currentTime - lastTickRef.current > tickInterval) {
        onTick();
        lastTickRef.current = currentTime;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onSpinComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, targetParticipant]);

  return (
    <div className="relative inline-block">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
        <div
          className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-foreground"
          style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" }}
        />
      </div>

      <canvas
        ref={canvasRef}
        width={320}
        height={320}
        className="border-4 border-foreground shadow-md"
        style={{ borderRadius: "50%" }}
      />
    </div>
  );
}
