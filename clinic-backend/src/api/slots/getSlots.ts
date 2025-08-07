import express from "express";
import { prisma } from "../../lib/prisma";

const getSlots = express.Router();

getSlots.get("/", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: "Missing 'from' or 'to' query parameters" });
    }

    const slots = await prisma.slot.findMany({
      where: {
        startAt: {
          gte: new Date(from as string),
          lte: new Date(to as string),
        },
      },
    });

    res.json(slots);
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default getSlots;
