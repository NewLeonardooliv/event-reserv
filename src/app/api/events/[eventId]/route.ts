import { NextResponse } from "next/server";
import { EVENTS } from "@/constants/events.constants";
import { acquireLock } from "@/config/lock";

export async function PATCH(request: Request, { params }: { params: { eventId: string } }) {
  const release = await acquireLock();

  try {
    const { eventId } = params;
    const { change } = await request.json();

    const event = EVENTS.find((event) => event.id === eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const updatedSlots = event.availableSlots + change;

    if (updatedSlots < 0) {
      return NextResponse.json(
        { message: "Cannot have negative available slots" },
        { status: 400 }
      );
    }

    event.availableSlots = updatedSlots;

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    release();
  }
}
