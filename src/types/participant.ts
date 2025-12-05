export interface Participant {
  id: string;
  name: string;
  entries: number;
}

export interface RaffleWinner {
  participant: Participant;
  order: number;
  timestamp: Date;
}
