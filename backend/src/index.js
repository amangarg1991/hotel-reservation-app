const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('../generated/prisma');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const prisma = new PrismaClient();

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// USERS CRUD
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/users', async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.create({ data: { email, name } });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/users/:id', async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data: { email, name } });
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// HOTELS CRUD
app.get('/hotels', async (req, res) => {
  const hotels = await prisma.hotel.findMany();
  res.json(hotels);
});

app.get('/hotels/:id', async (req, res) => {
  const hotel = await prisma.hotel.findUnique({ where: { id: Number(req.params.id) } });
  if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
  res.json(hotel);
});

app.post('/hotels', async (req, res) => {
  const { name, location } = req.body;
  try {
    const hotel = await prisma.hotel.create({ data: { name, location } });
    res.status(201).json(hotel);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/hotels/:id', async (req, res) => {
  const { name, location } = req.body;
  try {
    const hotel = await prisma.hotel.update({ where: { id: Number(req.params.id) }, data: { name, location } });
    res.json(hotel);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/hotels/:id', async (req, res) => {
  try {
    await prisma.hotel.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Add room type to a hotel
app.post('/hotels/:hotelId/room-types', async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  const { name, availability, date } = req.body;
  try {
    // Create the room type first
    const roomType = await prisma.roomType.create({
      data: { name, hotelId }
    });

    // If availability and date are provided, create initial inventory
    if (availability && date) {
      await prisma.roomInventory.create({
        data: {
          roomTypeId: roomType.id,
          date: new Date(date),
          availability: Number(availability)
        }
      });
    }

    res.status(201).json(roomType);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Get all room types for a hotel
app.get('/hotels/:hotelId/room-types', async (req, res) => {
  const hotelId = Number(req.params.hotelId);
  try {
    console.log('GET room types for hotelId:', hotelId);
    const roomTypes = await prisma.roomType.findMany({ where: { hotelId } });
    res.json(roomTypes);
  } catch (e) {
    console.error('Error fetching room types:', e);
    res.status(400).json({ error: e.message });
  }
});

// Get all inventory records for a room type
app.get('/room-types/:roomTypeId/inventory', async (req, res) => {
  const roomTypeId = Number(req.params.roomTypeId);
  const { date } = req.query;
  try {
    let where = { roomTypeId };
    if (date) where.date = new Date(date);
    const inventory = await prisma.roomInventory.findMany({ where });
    res.json(inventory);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Add inventory for a room type (date, availability)
app.post('/room-types/:roomTypeId/inventory', async (req, res) => {
  const roomTypeId = Number(req.params.roomTypeId);
  const { date, availability } = req.body;
  try {
    const inventory = await prisma.roomInventory.create({
      data: {
        roomTypeId,
        date: new Date(date),
        availability: Number(availability)
      }
    });
    res.status(201).json(inventory);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Edit inventory for a room type (by inventory id)
app.patch('/room-inventory/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { availability } = req.body;
  try {
    const inventory = await prisma.roomInventory.update({
      where: { id },
      data: { availability: Number(availability) }
    });
    res.json(inventory);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Helper function to check room availability for a date range
const checkRoomAvailability = async (roomTypeId, startDate, endDate, requestedRooms) => {
  try {
    // Get all inventory records for the room type within the date range
    const inventories = await prisma.roomInventory.findMany({
      where: {
        roomTypeId: Number(roomTypeId),
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }
    });

    // Check if we have inventory for all dates in the range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    // Check availability for each date
    for (const date of dates) {
      const inventory = inventories.find(inv => 
        inv.date.toDateString() === date.toDateString()
      );
      
      if (!inventory || inventory.availability < requestedRooms) {
        return {
          available: false,
          message: `Insufficient availability for ${date.toDateString()}. Available: ${inventory?.availability || 0}, Requested: ${requestedRooms}`
        };
      }
    }

    return { available: true };
  } catch (error) {
    return { available: false, message: 'Error checking availability' };
  }
};

// RESERVATIONS CRUD
app.get('/reservations', async (req, res) => {
  const reservations = await prisma.reservation.findMany({ 
    include: { user: true, hotel: true, roomType: true } 
  });
  res.json(reservations);
});

app.get('/reservations/:id', async (req, res) => {
  const reservation = await prisma.reservation.findUnique({ 
    where: { id: Number(req.params.id) }, 
    include: { user: true, hotel: true, roomType: true } 
  });
  if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
  res.json(reservation);
});

app.post('/reservations', async (req, res) => {
  const { userId, hotelId, roomTypeId, startDate, endDate, numberOfRooms } = req.body;
  
  try {
    // Check availability before creating reservation
    const availabilityCheck = await checkRoomAvailability(roomTypeId, startDate, endDate, numberOfRooms);
    
    if (!availabilityCheck.available) {
      return res.status(400).json({ 
        error: 'Insufficient room availability', 
        details: availabilityCheck.message 
      });
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({ 
      data: { 
        userId, 
        hotelId, 
        roomTypeId,
        startDate: new Date(startDate), 
        endDate: new Date(endDate),
        numberOfRooms: numberOfRooms || 1
      } 
    });

    // Update inventory for each date in the reservation range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      
      // Find and update the inventory for this date
      await prisma.roomInventory.updateMany({
        where: {
          roomTypeId: Number(roomTypeId),
          date: {
            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
          }
        },
        data: {
          availability: {
            decrement: numberOfRooms
          }
        }
      });
    }

    res.status(201).json(reservation);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.put('/reservations/:id', async (req, res) => {
  const { userId, hotelId, roomTypeId, startDate, endDate, numberOfRooms } = req.body;
  try {
    const reservation = await prisma.reservation.update({ 
      where: { id: Number(req.params.id) }, 
      data: { 
        userId, 
        hotelId, 
        roomTypeId,
        startDate: new Date(startDate), 
        endDate: new Date(endDate),
        numberOfRooms: numberOfRooms || 1
      } 
    });
    res.json(reservation);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.delete('/reservations/:id', async (req, res) => {
  try {
    await prisma.reservation.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Add room inventory
app.post('/room-inventory', async (req, res) => {
  const { roomTypeId, availability, date } = req.body;
  try {
    const inventory = await prisma.roomInventory.create({
      data: {
        roomTypeId: Number(roomTypeId),
        availability: Number(availability),
        date: new Date(date)
      }
    });
    res.status(201).json(inventory);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 