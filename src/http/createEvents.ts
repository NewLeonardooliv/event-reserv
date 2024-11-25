import { API } from "@/constants/api.constants";
import { Event } from "@/model/event";

export async function createEvent(event: Event): Promise<Event> {
  const response = await fetch(`${API}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Failed to create event");
  }

  return response.json();
}
