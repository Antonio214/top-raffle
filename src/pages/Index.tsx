import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ParticipantForm } from "@/components/ParticipantForm";
import { ParticipantList } from "@/components/ParticipantList";
import { RouletteWheel } from "@/components/RouletteWheel";
import { RaffleHistory } from "@/components/RaffleHistory";
import { WinnerModal } from "@/components/WinnerModal";
import { useRaffle } from "@/hooks/useRaffle";
import { useSound } from "@/hooks/useSound";
import { Participant } from "@/types/participant";
import { Dices, RotateCcw } from "lucide-react";
import { toast } from "sonner";
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

const Index = () => {
  const {
    participants,
    winners,
    isSpinning,
    setIsSpinning,
    currentWinner,
    addParticipant,
    updateParticipant,
    removeParticipant,
    selectWinner,
    executeRaffle,
    clearCurrentWinner,
    resetAll,
  } = useRaffle();

  const { playTick, playWinner } = useSound();
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [targetParticipant, setTargetParticipant] =
    useState<Participant | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const handleStartRaffle = () => {
    if (participants.length === 0) {
      toast.error("Add at least one participant");
      return;
    }

    const winner = selectWinner();
    if (winner) {
      setTargetParticipant(winner);
      setIsSpinning(true);
    }
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
    if (targetParticipant) {
      executeRaffle(targetParticipant);
      setShowWinnerModal(true);
      playWinner();
    }
  };

  const handleCloseWinnerModal = () => {
    setShowWinnerModal(false);
    clearCurrentWinner();
    setTargetParticipant(null);
  };

  const handleReset = () => {
    resetAll();
    setEditingParticipant(null);
    setTargetParticipant(null);
    toast.success("Raffle reset!");
  };

  // Update form when editing participant changes
  useEffect(() => {
    if (editingParticipant) {
      const stillExists = participants.find(
        (p) => p.id === editingParticipant.id
      );
      if (!stillExists) {
        setEditingParticipant(null);
      }
    }
  }, [participants, editingParticipant]);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
            RAFFLE WHEEL
          </h1>
          <p className="text-muted-foreground font-mono">
            Add participants and spin the wheel!
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Participants */}
          <div className="space-y-6">
            <section className="border-2 border-foreground bg-card p-4 shadow-sm">
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">
                {editingParticipant ? "Edit Participant" : "New Participant"}
              </h2>
              <ParticipantForm
                key={editingParticipant?.id ?? "new"}
                onAdd={addParticipant}
                onUpdate={updateParticipant}
                editingParticipant={editingParticipant}
                onCancelEdit={() => setEditingParticipant(null)}
              />
            </section>

            <section className="border-2 border-foreground bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wide">
                  Participants ({participants.length})
                </h2>
                {participants.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isSpinning}
                        className="border-2 border-foreground shadow-2xs hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" /> Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-2 border-foreground shadow-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Raffle</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove all participants and clear the
                          raffle history. Do you want to continue?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-2 border-foreground">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleReset}
                          className="bg-destructive text-destructive-foreground border-2 border-foreground"
                        >
                          Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <ParticipantList
                participants={participants}
                onEdit={setEditingParticipant}
                onRemove={removeParticipant}
                disabled={isSpinning}
              />
            </section>
          </div>

          {/* Center Column - Wheel */}
          <div className="flex flex-col items-center justify-start gap-6">
            <RouletteWheel
              participants={participants}
              isSpinning={isSpinning}
              targetParticipant={targetParticipant}
              onSpinComplete={handleSpinComplete}
              onTick={playTick}
            />

            <Button
              onClick={handleStartRaffle}
              disabled={isSpinning || participants.length === 0}
              size="lg"
              className="w-full max-w-xs text-lg font-bold border-4 border-foreground shadow-md hover:shadow-sm hover:translate-x-[4px] hover:translate-y-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Dices className="w-5 h-5 mr-2" />
              {isSpinning ? "SPINNING..." : "DRAW"}
            </Button>

            <p className="text-sm text-muted-foreground font-mono text-center">
              Total entries:{" "}
              {participants.reduce((sum, p) => sum + p.entries, 0)}
            </p>
          </div>

          {/* Right Column - History */}
          <div>
            <section className="border-2 border-foreground bg-card p-4 shadow-sm">
              <h2 className="text-lg font-bold mb-4 uppercase tracking-wide">
                History ({winners.length})
              </h2>
              <RaffleHistory winners={winners} />
            </section>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <WinnerModal
        winner={showWinnerModal ? currentWinner : null}
        order={winners.length}
        onClose={handleCloseWinnerModal}
      />
    </main>
  );
};

export default Index;
