import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to check if user is admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}

// Get a single event
export async function GET(request, { params }) {
  if (!await isAdmin()) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        bookings: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update an event
export async function PUT(request, { params }) {
  if (!await isAdmin()) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const requestBody = await request.json();
    console.log('Update endpoint - Received request body:', requestBody);
    const { title, description, venue, category, date, price, availableTickets, imageUrl } = requestBody;

    // Validate required fields
    if (!title || !description || !venue || !date || price === undefined || !availableTickets) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // Update the event
    console.log('Update endpoint - Updating event with imageUrl:', imageUrl);

    // Check if imageUrl is a valid URL
    let finalImageUrl = imageUrl;

    // If imageUrl is empty or undefined, keep the existing one or use placeholder
    if (!finalImageUrl || finalImageUrl.trim() === '') {
      console.warn('Warning: imageUrl is missing or empty, using existing or placeholder');
      finalImageUrl = existingEvent.imageUrl || '/event-placeholder.jpg';
    } else {
      // Validate that it's a real URL
      try {
        new URL(finalImageUrl);
        console.log('Valid URL detected:', finalImageUrl);
      } catch (e) {
        console.warn('Invalid URL format, using existing or placeholder instead');
        finalImageUrl = existingEvent.imageUrl || '/event-placeholder.jpg';
      }
    }

    // Log the final URL being used
    console.log('Update endpoint - Final imageUrl to be used:', finalImageUrl);

    const eventData = {
      title,
      description,
      venue,
      category,
      date: new Date(date),
      price: parseFloat(price),
      availableTickets: parseInt(availableTickets),
      imageUrl: finalImageUrl,
    };

    console.log('Update endpoint - Event data to be saved:', eventData);

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: eventData,
    });

    console.log('Update endpoint - Updated event:', updatedEvent);

    return NextResponse.json(
      { message: "Event updated successfully", event: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete an event
export async function DELETE(request, { params }) {
  if (!await isAdmin()) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // Delete all bookings for this event first
    await prisma.booking.deleteMany({
      where: { eventId: id },
    });

    // Delete the event
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
