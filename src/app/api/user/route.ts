import { EVENTS } from "@/constants/events.constants";
import { USERS } from "@/constants/users.constants";
import { User } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(EVENTS);
}

export async function POST(request: Request) {
  const user: User = await request.json();

  USERS.push(user);

  return NextResponse.json(user, { status: 201 });
}
