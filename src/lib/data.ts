const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Event {
  id: string;
  name: string;
  availableSlots: number;
}

export interface User {
  id: string;
  name: string;
}

const events: Event[] = [
  { id: "1", name: "Conferência de Tecnologia", availableSlots: 100 },
  { id: "2", name: "Workshop de Design", availableSlots: 50 },
  { id: "3", name: "Hackathon de IA", availableSlots: 200 },
];

const onlineUsers: User[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" },
];

const waitingList: User[] = [
  { id: "4", name: "David" },
  { id: "5", name: "Eve" },
];

export async function getEvents(): Promise<Event[]> {
  await delay(500);
  return events;
}

export async function getOnlineUsers(): Promise<User[]> {
  await delay(300);
  return onlineUsers;
}

export async function getWaitingList(): Promise<User[]> {
  await delay(300);
  return waitingList;
}
