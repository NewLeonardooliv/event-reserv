import { EVENTS } from "@/constants/events.constants";
import { Event } from "@/model/event";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(EVENTS);
}

export async function POST(request: Request) {
  const event: Event = await request.json();
  
  EVENTS.push(event);

  return NextResponse.json(event, { status: 201 });
}
