import { Response, Request } from "express";
import { prisma } from "../../lib/prisma";


export const userInvoice = async (req: any, res: Response) => {
  try {
   const userId = Number(req.query.userId); 

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "Valid User ID required" });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include:{
        user:true,
       items:true,
      }
    });

    return res.status(200).json({
      message: "Invoice fetched successfully",
      data: invoices,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const singleInvoice = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
  //  const userId = req.user.id;

    const invoice = await prisma.invoice.findFirst({
      where: {
        id: idNumber,
     
        // userId: userId, 
        
      },
      include:{
        user:true,
        items:true
      }
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json({
      message: "Invoice fetched successfully",
      data: invoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};