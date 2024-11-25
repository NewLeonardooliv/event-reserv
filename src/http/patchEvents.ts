import { API } from "@/constants/api.constants";
import { Event } from "@/model/event";

export async function patchEvent(eventId: string, change: number): Promise<Event> {
  const response = await fetch(`${API}/events/${eventId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ change }),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
}