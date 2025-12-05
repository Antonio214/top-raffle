import { RaffleWinner } from "@/types/participant";
import { Trophy } from "lucide-react";

interface RaffleHistoryProps {
  winners: RaffleWinner[];
}

export function RaffleHistory({ winners }: RaffleHistoryProps) {
  if (winners.length === 0) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/30 p-6 text-center">
        <Trophy className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-muted-foreground font-mono text-sm">
          No draws yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[250px] overflow-y-auto">
      {winners.map((winner) => (
        <div
          key={`${winner.participant.id}-${winner.order}`}
          className="flex items-center gap-3 p-3 border-2 border-foreground bg-card shadow-xs"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-foreground text-background font-bold text-sm">
            {winner.order}º
          </div>
          <div className="flex-1">
            <p className="font-bold">{winner.participant.name}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {winner.participant.entries} entries
            </p>
          </div>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </div>
      ))}
    </div>
  );
}
