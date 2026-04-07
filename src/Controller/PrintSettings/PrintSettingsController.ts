import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { log } from "console";

// Define the shape of the update request body
interface UpdateLayoutRequest {
  layout: string;
}

export const getPrintSettings = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    log(userId)
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "Valid User ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { printLayout: true },
    });

    // Fallback to "1" (Classic) if no layout is found
    return res.json({ layout: user?.printLayout || "1" });
  } catch (error) {
    console.error("[GET_PRINT_SETTINGS_ERROR]:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePrintSettings = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    const { layout }: UpdateLayoutRequest = req.body;


    if (!userId || isNaN(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!layout) {
      return res.status(400).json({ message: "Layout selection is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { printLayout: String(layout) },
    });

    return res.json({ 
      message: "Settings updated", 
      layout: updatedUser.printLayout 
    });
  } catch (error) {
    console.error("[UPDATE_PRINT_SETTINGS_ERROR]:", error);
    return res.status(500).json({ message: "Failed to update settings" });
  }
};