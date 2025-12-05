import { Participant } from "@/types/participant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, PartyPopper } from "lucide-react";

interface WinnerModalProps {
  winner: Participant | null;
  order: number;
  onClose: () => void;
}

export function WinnerModal({ winner, order, onClose }: WinnerModalProps) {
  if (!winner) return null;

  return (
    <Dialog open={!!winner} onOpenChange={() => onClose()}>
      <DialogContent className="border-4 border-foreground shadow-lg text-center max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
            <PartyPopper className="w-6 h-6" />
            We Have a Winner!
            <PartyPopper className="w-6 h-6" />
          </DialogTitle>
          <DialogDescription className="sr-only">
            Raffle result
          </DialogDescription>
        </DialogHeader>

        <div className="py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-foreground text-background font-bold text-xl mb-4">
            #{order}
          </div>
          <h2 className="text-3xl font-bold mb-2">{winner.name}</h2>
          <p className="text-muted-foreground font-mono">
            With {winner.entries} entries
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Congratulations to the winner!</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <Button
          onClick={onClose}
          className="w-full border-2 border-foreground shadow-sm hover:shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
