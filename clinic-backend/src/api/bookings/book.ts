import express from "express";
import { prisma } from "../../lib/prisma";
import { authenticate } from "../../middlewares/authMiddleware";

const book = express.Router();

book.post("/", authenticate, async (req: any, res) => {
  const { slotId } = req.body;

  try {
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    if (!slot) return res.status(404).json({ error: "Slot not found" });

    const existingBooking = await prisma.booking.findUnique({
      where: { slotId }, // Works only if `slotId` is unique in schema
    });

    if (existingBooking) {
      return res.status(400).json({ error: "Slot already booked" });
    }
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.userId,
        slotId,
      },
    });

    res.json(booking);
  } catch (err: any) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err?.message || "Server error" });
  }
});

export default book;
