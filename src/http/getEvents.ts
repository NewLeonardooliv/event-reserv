import { API } from "@/constants/api.constants";
import { Event } from "@/model/event";

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API}/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to list event");
  }

  return response.json();
}
