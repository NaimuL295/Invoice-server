import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

// Save/update layout
export const printOption = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { layout } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { printLayout: layout },  // correct case
    });

    res.json({ layout: user.printLayout || "1" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Fetch layout
export const PrintFind = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { printLayout: true }, // correct case
    });

    res.json({ layout: user?.printLayout || "1" }); // correct case
  } catch (error) {
    console.error(error);
    res.status(500).json({ layout: "1" });
  }
};

// Another save method (optional, same as printOption)
export const printSelect = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { layout } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { printLayout: layout },  // correct case
    });

    res.json({ message: "Saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};