import express from "express";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../middlewares/authMiddleware";

const myBookings = express.Router();

myBookings.get("/", authenticate, async (req: any, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.userId },
      include: { slot: true },
    });
    res.json(bookings);
  } catch {
    res.status(500).json({ error: "Could not fetch bookings" });
  }
});

export default myBookings;
