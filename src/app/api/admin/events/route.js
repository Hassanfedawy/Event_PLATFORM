import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to check if user is admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}

// Get all events (admin view)
export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
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
          },
        },
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Get events error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new event
export async function POST(request) {
  if (!await isAdmin()) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    const requestBody = await request.json();
    console.log('Received request body:', requestBody);
    const { title, description, venue, category, date, price, availableTickets, imageUrl } = requestBody;

    // Validate required fields
    if (!title || !description || !venue || !date || price === undefined || !availableTickets) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the event
    console.log('Creating event with imageUrl:', imageUrl);

    // Check if imageUrl is a valid Cloudinary URL
    let finalImageUrl = imageUrl;

    // If imageUrl is empty or undefined, use placeholder
    if (!finalImageUrl || finalImageUrl.trim() === '') {
      console.warn('Warning: imageUrl is missing or empty, using placeholder');
      finalImageUrl = '/event-placeholder.jpg';
    } else {
      // Validate that it's a real URL
      try {
        new URL(finalImageUrl);
        console.log('Valid URL detected:', finalImageUrl);
      } catch (e) {
        console.warn('Invalid URL format, using placeholder instead');
        finalImageUrl = '/event-placeholder.jpg';
      }
    }

    const eventData = {
      title,
      description,
      venue,
      category,
      date: new Date(date),
      price: parseFloat(price),
      availableTickets: parseInt(availableTickets),
      imageUrl: finalImageUrl,
      creatorId: session.user.id,
    };

    console.log('Event data to be saved:', eventData);

    const event = await prisma.event.create({
      data: eventData,
    });

    console.log('Created event:', event);

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
