# Hotel Reservation App

A full-stack hotel reservation system with room management, inventory tracking, and booking capabilities.

## Features

- **User Management**: Add, view, and delete users
- **Hotel Management**: Manage hotels with locations
- **Room Types**: Create and manage different room types per hotel
- **Inventory Management**: Track room availability by date
- **Reservation System**: Book rooms with date range and quantity validation
- **Real-time Availability**: Prevents overbooking with inventory checks

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Railway (recommended)

## Quick Start (Local Development)

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hotel-reservation-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   **Backend** (`backend/prisma/.env`):
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/hotel_reservation"
   ```
   
   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:4000
   ```

4. **Set up database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend: http://localhost:4000
   - Frontend: http://localhost:5173

## Deployment Options

### Option 1: Railway (Recommended)

**Backend Deployment:**

1. **Create Railway account** at [railway.app](https://railway.app)

2. **Deploy backend:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize and deploy
   cd backend
   railway init
   railway up
   ```

3. **Set environment variables in Railway dashboard:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `PORT`: Railway will set this automatically
   - `FRONTEND_URL`: Your frontend URL (set after frontend deployment)

**Frontend Deployment:**

1. **Deploy frontend:**
   ```bash
   cd frontend
   railway init
   railway up
   ```

2. **Set environment variables:**
   - `VITE_API_URL`: Your backend Railway URL

### Option 2: Vercel + Railway

**Backend:** Deploy to Railway (as above)
**Frontend:** Deploy to Vercel

1. **Connect GitHub repository to Vercel**
2. **Set build settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Set environment variable:**
   - `VITE_API_URL`: Your Railway backend URL

### Option 3: Render

**Backend:**
1. Connect GitHub repository
2. Set build command: `npm install && npx prisma generate`
3. Set start command: `npm start`
4. Add environment variables

**Frontend:**
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set static publish directory: `dist`

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@host:port/database"
PORT=4000
FRONTEND_URL="https://your-frontend-url.com"
```

### Frontend (.env)
```env
VITE_API_URL="https://your-backend-url.com"
```

## API Endpoints

### Users
- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Hotels
- `GET /hotels` - Get all hotels
- `POST /hotels` - Create hotel
- `PUT /hotels/:id` - Update hotel
- `DELETE /hotels/:id` - Delete hotel

### Room Types
- `GET /hotels/:hotelId/room-types` - Get room types for hotel
- `POST /hotels/:hotelId/room-types` - Add room type to hotel

### Inventory
- `GET /room-types/:roomTypeId/inventory` - Get inventory for room type
- `POST /room-types/:roomTypeId/inventory` - Add inventory record
- `PATCH /room-inventory/:id` - Update inventory

### Reservations
- `GET /reservations` - Get all reservations
- `POST /reservations` - Create reservation (with availability validation)
- `PUT /reservations/:id` - Update reservation
- `DELETE /reservations/:id` - Delete reservation

## Database Schema

The app uses PostgreSQL with the following main tables:
- `User` - User information
- `Hotel` - Hotel details
- `RoomType` - Room types per hotel
- `RoomInventory` - Availability by date
- `Reservation` - Booking records

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own hotel management needs! 