import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all events (public view)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const category = searchParams.get('category');
    const venue = searchParams.get('venue');

    // Build filter conditions
    const where = {};

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    if (category) {
      where.category = category;
    }

    if (venue) {
      where.venue = {
        contains: venue,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
      include: {
        creator: {
          select: {
            name: true,
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
