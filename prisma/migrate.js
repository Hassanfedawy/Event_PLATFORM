// This script will apply the schema changes to the database
// Run with: node prisma/migrate.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database migration...');

  try {
    // Get all events
    const events = await prisma.event.findMany();
    console.log(`Found ${events.length} events to update`);

    // Update each event with default values for new fields
    for (const event of events) {
      await prisma.event.update({
        where: { id: event.id },
        data: {
          // Use location as venue if venue is not set
          venue: event.venue || event.location || '',
          category: event.category || 'Other',
        },
      });
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
