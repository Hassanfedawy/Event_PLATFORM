import prisma from "@/lib/prisma";

export const getAllEvents = async (title, category, venue) => {
  try {
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

    return await prisma.event.findMany({
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
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getEventById = async (id) => {
  try {
    return await prisma.event.findUnique({
      where: { id },
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
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    return null;
  }
};

export const getUserBookings = async (userId) => {
  try {
    return await prisma.booking.findMany({
      where: { userId },
      select: { eventId: true },
    });
  } catch (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error);
    return [];
  }
};

export const isEventBookedByUser = async (eventId, userId) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        eventId,
        userId,
      },
    });
    return !!booking;
  } catch (error) {
    console.error(`Error checking if event ${eventId} is booked by user ${userId}:`, error);
    return false;
  }
};
