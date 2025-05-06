import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Check if we already have events
    const eventCount = await prisma.event.count();

    if (eventCount > 0) {
      return NextResponse.json(
        { message: "Database already has events" },
        { status: 200 }
      );
    }

    // Create a test user if none exists
    let adminUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@example.com",
          password: "$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm", // password is "password"
        },
      });
    }

    // Sample events
    const events = [
      {
        title: "Web Development Workshop",
        description: "Learn the basics of web development with HTML, CSS, and JavaScript.",
        location: "Tech Hub, 123 Main St",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        price: 25.0,
        availableTickets: 30,
        imageUrl: "/event-placeholder.jpg",
        creatorId: adminUser.id,
      },
      {
        title: "Data Science Conference",
        description: "Join industry experts for a day of talks on the latest in data science.",
        location: "Convention Center, 456 Park Ave",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        price: 99.0,
        availableTickets: 200,
        imageUrl: "/event-placeholder.jpg",
        creatorId: adminUser.id,
      },
      {
        title: "Mobile App Development Bootcamp",
        description: "Intensive 3-day bootcamp on building mobile apps with React Native.",
        location: "Innovation Lab, 789 Tech Blvd",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        price: 149.0,
        availableTickets: 50,
        imageUrl: "/event-placeholder.jpg",
        creatorId: adminUser.id,
      },
    ];

    // Add events to database
    await prisma.event.createMany({
      data: events,
    });

    return NextResponse.json(
      { message: "Sample events created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { message: "Error seeding database", error: error.message },
      { status: 500 }
    );
  }
}