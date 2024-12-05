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
}

const currentSettings: SystemSettings = {
  maxUsers: 10,
  choiceTime: 120,
};

export async function createEvent({ name, slots }: EventData): Promise<void> {
  await delay(500);
  const event = { id: String(EVENTS.length + 1), name, availableSlots: slots };
  EVENTS.push(event);
}

interface Settings {
  maxUsers: number;
  choiceTime: number;
}

export async function updateSettings(settings: Settings): Promise<void> {
  console.log(`Configurações atualizadas: ${JSON.stringify(settings)}`);

  currentSettings.choiceTime = settings.choiceTime
  currentSettings.maxUsers = settings.maxUsers
}

export async function getSettings(): Promise<SystemSettings> {
  return currentSettings;
}
