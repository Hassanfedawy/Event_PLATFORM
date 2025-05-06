# Event Platform

A modern, responsive web application for managing and booking events. Built with Next.js, Tailwind CSS, and MongoDB.

![Event Platform](https://res.cloudinary.com/demo/image/upload/v1/event_platform/event_placeholder.jpg)

## Features

### User Features
- Browse upcoming events with filtering by category and search by title
- View detailed event information
- Book events with a simple one-click process
- User authentication (sign up, sign in, sign out)
- Dark mode support
- Responsive design for all screen sizes

### Admin Features
- Admin panel for event management
- Create, read, update, and delete events
- Upload event images using Cloudinary
- Manage event details including:
  - Title
  - Description
  - Date and time
  - Venue
  - Category
  - Price
  - Available tickets

## Tech Stack

### Frontend
- **Next.js**: React framework for server-side rendering and static site generation
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **NextAuth.js**: Authentication solution for Next.js
- **Heroicons**: SVG icon set for UI elements

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database for storing event and user data
- **Prisma**: ORM for database access
- **Cloudinary**: Cloud-based image management

## Project Structure

```
event_platform/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── admin/            # Admin panel pages
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── events/           # Event pages
│   │   ├── globals.css       # Global styles
│   │   ├── layout.jsx        # Root layout
│   │   └── page.jsx          # Home page
│   ├── components/           # Reusable components
│   │   ├── admin/            # Admin-specific components
│   │   ├── EventCard.jsx     # Event card component
│   │   ├── NavBar.jsx        # Navigation bar
│   │   └── ...
│   ├── lib/                  # Utility functions and libraries
│   │   ├── cloudinary.js     # Cloudinary configuration
│   │   ├── prisma.js         # Prisma client
│   │   └── ...
│   └── ...
├── prisma/                   # Prisma schema and migrations
├── public/                   # Static assets
├── .env                      # Environment variables
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies
└── tailwind.config.js        # Tailwind CSS configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB database
- Cloudinary account

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL="your_mongodb_connection_string"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event-platform.git
cd event-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## User Guide

### Regular Users
1. **Browse Events**: Visit the home page to see all upcoming events.
2. **Filter Events**: Use the category dropdown to filter events by type.
3. **Search Events**: Use the search bar to find events by title.
4. **View Event Details**: Click on an event card to see detailed information.
5. **Book an Event**: Click the "Book Now" button to reserve a spot.
6. **Authentication**: Sign up or sign in to book events and view your bookings.
7. **Dark Mode**: Toggle between light and dark mode using the icon in the navigation bar.

### Admin Users
1. **Access Admin Panel**: Sign in with admin credentials and click "Admin Panel" in the navigation bar.
2. **Manage Events**: Create, view, edit, and delete events from the admin dashboard.
3. **Create Events**: Fill out the event form with details and upload an image.
4. **Edit Events**: Modify event details or update images for existing events.

## API Endpoints

### Authentication
- `POST /api/auth/signup`: Create a new user account
- `POST /api/auth/signin`: Sign in to an existing account
- `GET /api/auth/session`: Get the current session information
- `POST /api/auth/signout`: Sign out the current user

### Events
- `GET /api/events`: Get all events
- `GET /api/events/:id`: Get a specific event by ID
- `POST /api/admin/events`: Create a new event (admin only)
- `PUT /api/admin/events/:id`: Update an existing event (admin only)
- `DELETE /api/admin/events/:id`: Delete an event (admin only)

### Bookings
- `GET /api/bookings`: Get all bookings for the current user
- `POST /api/bookings`: Create a new booking
- `DELETE /api/bookings/:id`: Cancel a booking

### Image Upload
- `POST /api/upload`: Upload an image to Cloudinary

## Responsive Design

The application is fully responsive and works on all screen sizes:
- Mobile: Optimized layout with collapsible menu
- Tablet: Adjusted grid layout for medium screens
- Desktop: Full layout with multi-column grid

## Dark Mode

The application supports dark mode, which can be toggled using the icon in the navigation bar. Dark mode settings are saved in local storage for persistence.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
