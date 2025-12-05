import { Participant } from "@/types/participant";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ParticipantListProps {
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

const WHEEL_COLORS = [
  "bg-wheel-1",
  "bg-wheel-2",
  "bg-wheel-3",
  "bg-wheel-4",
  "bg-wheel-5",
  "bg-wheel-6",
  "bg-wheel-7",
  "bg-wheel-8",
];

export function ParticipantList({
  participants,
  onEdit,
  onRemove,
  disabled,
}: ParticipantListProps) {
  const totalEntries = participants.reduce((sum, p) => sum + p.entries, 0);

  if (participants.length === 0) {
    return (
      <div className="border-2 border-dashed border-muted-foreground/30 p-8 text-center">
        <p className="text-muted-foreground font-mono text-sm">
          No participants registered
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {participants.map((participant, index) => {
        const percentage = ((participant.entries / totalEntries) * 100).toFixed(
          1
        );
        const colorClass = WHEEL_COLORS[index % WHEEL_COLORS.length];

        return (
          <div
            key={participant.id}
            className="flex items-center gap-3 p-3 border-2 border-foreground bg-card shadow-xs"
          >
            <div
              className={`w-4 h-4 ${colorClass} border border-foreground flex-shrink-0`}
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{participant.name}</p>
              <p className="text-xs text-muted-foreground font-mono">
                {participant.entries} entries ({percentage}%)
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(participant)}
                disabled={disabled}
                className="h-8 w-8 border-2 border-foreground shadow-2xs hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              >
                <Pencil className="w-3 h-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={disabled}
                    className="h-8 w-8 border-2 border-foreground shadow-2xs hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-2 border-foreground shadow-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Participant</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove{" "}
                      <strong>{participant.name}</strong> from the raffle?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-2 border-foreground">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onRemove(participant.id)}
                      className="bg-destructive text-destructive-foreground border-2 border-foreground"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
      })}
    </div>
  );
}
