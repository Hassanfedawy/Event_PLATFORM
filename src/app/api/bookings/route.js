import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // Check if the user has already booked this event
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        eventId,
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { message: "You have already booked this event" },
        { status: 409 }
      );
    }

    // Check if there are available tickets
    const bookingsCount = await prisma.booking.count({
      where: { eventId },
    });

    // Get the available tickets (either from the event or default to 100)
    const availableTickets = event.availableTickets || 100;

    if (bookingsCount >= availableTickets) {
      return NextResponse.json(
        { message: "This event is fully booked" },
        { status: 400 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        eventId,
      },
    });

    return NextResponse.json(
      { message: "Event booked successfully", booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        event: true,
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}