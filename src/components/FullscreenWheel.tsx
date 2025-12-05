import { Participant } from "@/types/participant";
import { RouletteWheel } from "./RouletteWheel";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface FullscreenWheelProps {
  isOpen: boolean;
  participants: Participant[];
  isSpinning: boolean;
  targetParticipant: Participant | null;
  onSpinComplete: () => void;
  onTick: () => void;
  onClose: () => void;
}

export function FullscreenWheel({
  isOpen,
  participants,
  isSpinning,
  targetParticipant,
  onSpinComplete,
  onTick,
  onClose,
}: FullscreenWheelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 border-2 border-foreground"
        onClick={onClose}
        disabled={isSpinning}
      >
        <X className="w-6 h-6" />
      </Button>

      <div className="scale-[1.8] md:scale-[2.2]">
        <RouletteWheel
          participants={participants}
          isSpinning={isSpinning}
          targetParticipant={targetParticipant}
          onSpinComplete={onSpinComplete}
          onTick={onTick}
        />
      </div>
    </div>
  );
}
