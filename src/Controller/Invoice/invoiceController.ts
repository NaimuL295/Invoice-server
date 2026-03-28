import { Response, Request } from "express";
import { prisma } from "../../lib/prisma";

export const userInvoice = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }
    const invoices = await prisma.invoice.findMany({
      where: { userId: userIdNumber },
      orderBy: {
        id: "desc",
      },
    });

    res
      .status(200)
      .json({ message: "Invoice fetched successfully", data: invoices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const singleInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);

    //  invalid id check
    if (isNaN(idNumber)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: idNumber,
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    //  success response
    res.status(200).json({
      message: "Invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
