import { useState, useCallback } from "react";
import { Participant, RaffleWinner } from "@/types/participant";

export function useRaffle() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<RaffleWinner[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);

  const addParticipant = useCallback((name: string, entries: number) => {
    const exists = participants.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return false;

    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name,
      entries,
    };
    setParticipants((prev) => [...prev, newParticipant]);
    return true;
  }, [participants]);

  const updateParticipant = useCallback(
    (id: string, name: string, entries: number) => {
      const exists = participants.some(
        (p) => p.id !== id && p.name.toLowerCase() === name.toLowerCase()
      );
      if (exists) return false;

      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name, entries } : p))
      );
      return true;
    },
    [participants]
  );

  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const selectWinner = useCallback((): Participant | null => {
    if (participants.length === 0) return null;

    const totalEntries = participants.reduce((sum, p) => sum + p.entries, 0);
    let random = Math.random() * totalEntries;

    for (const participant of participants) {
      random -= participant.entries;
      if (random <= 0) {
        return participant;
      }
    }
    return participants[participants.length - 1];
  }, [participants]);

  const executeRaffle = useCallback((winner: Participant) => {
    const newWinner: RaffleWinner = {
      participant: winner,
      order: winners.length + 1,
      timestamp: new Date(),
    };
    setWinners((prev) => [...prev, newWinner]);
    setCurrentWinner(winner);
    setParticipants((prev) => prev.filter((p) => p.id !== winner.id));
  }, [winners.length]);

  const clearCurrentWinner = useCallback(() => {
    setCurrentWinner(null);
  }, []);

  const resetAll = useCallback(() => {
    setParticipants([]);
    setWinners([]);
    setCurrentWinner(null);
  }, []);

  return {
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
  };
}
