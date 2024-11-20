"use server";

import { EVENTS } from "@/constants/events.constants";
import { revalidatePath } from "next/cache";
import { delay } from "./utils";

export async function reserveEvent(eventId: string): Promise<void> {
  console.log(`Reserva para o evento ${eventId} criada`);
  revalidatePath("/");
}

interface EventData {
  name: string;
  slots: number;
}

interface SystemSettings {
  maxUsers: number;
  choiceTime: number;
  allowWaitlist: boolean;
  autoConfirmReservations: boolean;
}

const currentSettings: SystemSettings = {
  maxUsers: 10,
  choiceTime: 120,
  allowWaitlist: true,
  autoConfirmReservations: false,
};

export async function createEvent({ name, slots }: EventData): Promise<void> {
  await delay(500);
  const event = { id: String(EVENTS.length + 1), name, availableSlots: slots };
  console.log(event);
  EVENTS.push(event);
  console.log(EVENTS);
}

interface Settings {
  maxUsers: number;
  choiceTime: number;
}

export async function updateSettings(settings: Settings): Promise<void> {
  console.log(`Configurações atualizadas: ${JSON.stringify(settings)}`);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function getSettings(): Promise<SystemSettings> {
  return currentSettings;
}
