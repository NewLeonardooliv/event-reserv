'use server'

import { revalidatePath } from 'next/cache'

export async function reserveEvent(eventId: string): Promise<void> {
  console.log(`Reserva para o evento ${eventId} criada`)
  revalidatePath('/')
}

interface EventData {
  name: string;
  slots: number;
}

export async function createEvent(eventData: EventData): Promise<void> {
  console.log(`Evento ${eventData.name} criado com ${eventData.slots} vagas`)
  revalidatePath('/')
  revalidatePath('/admin')
}

interface Settings {
  maxUsers: number;
  choiceTime: number;
}

export async function updateSettings(settings: Settings): Promise<void> {
  console.log(`Configurações atualizadas: ${JSON.stringify(settings)}`)
  revalidatePath('/')
  revalidatePath('/admin')
}