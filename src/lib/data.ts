import { EVENTS } from "@/constants/events.constants";
import { Event } from "@/model/event";
import { delay } from "./utils";


export interface User {
  id: string;
  name: string;
}

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

  return EVENTS;
}

export async function getOnlineUsers(): Promise<User[]> {
  await delay(300);
  return onlineUsers;
}

export async function getWaitingList(): Promise<User[]> {
  await delay(300);
  return waitingList;
}
