import "dotenv/config"
import { Response, Request } from "express";
import { prisma } from "../../lib/prisma.js";
import { CreateInvoiceRequest } from "../../type.js";


type TypedRequest<T> = Request<{}, {}, T>;

export const createInvoice = async (
  req: TypedRequest<CreateInvoiceRequest>,
  res: Response,
) => {
  try {
    const {
      uid,
      userId,
      date,
      customer,
      items,
      subtotal,
      total,
      discount,
      received,
      due,
      paymentType,
      description,
    } = req.body;

    // Logging for debugging
    console.log("Request Body:", req.body);

    const invoiceCreate = await prisma.invoice.create({
      data: {
        uid: uid || undefined, // Ensures default UUID triggers if uid is missing
        date: date ? new Date(date) : new Date(),
        customer,
        subtotal: Number(subtotal),
        discount: Number(discount || 0),
        received: Number(received || 0),
        total: Number(total),
        due: Number(due || 0),
        description,
        paymentType,
        user: {
          connect: { id: Number(userId) },
        },
        items: {
          create: items.map((item: any) => ({
            item_name: item.item_name,
            quantity: Number(item.quantity),
            unit: item.unit,
            price: Number(item.price),
          })),
        },
      },

      include: {
        items: true,
      },
    });

    return res.status(201).json(invoiceCreate);
  } catch (error: any) {
    console.error("Prisma Creation Error:", error);
    return res.status(500).json({
      message: "Error creating invoice",
      error: error.message,
    });
  }
};

export const userInvoice = async (req: any, res: Response) => {
  try {
    const userId = Number(req.query.userId);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "Valid User ID required" });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: {
        user: true,
        items: true,
      },
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
      include: {
        user: true,
        items: true,
      },
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

// 3. The Controller


export const modifyInvoice = async (req: any, res: Response) => {
  try {
  
    const { id } = req.params; 
    const invoiceId = Number(id);

    if (isNaN(invoiceId)) {
      return res.status(400).json({ message: "Invalid Invoice ID" });
    }

    const {
      userId,
      date,
      customer,
      items,
      subtotal,
      total,
      discount,
      received,
      due,
      paymentType,
      description,
    } = req.body;

    
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        date: date ? new Date(date) : undefined,
        customer: customer || undefined,
        subtotal: subtotal !== undefined ? Number(subtotal) : undefined,
        discount: discount !== undefined ? Number(discount) : undefined,
        received: received !== undefined ? Number(received) : undefined,
        total: total !== undefined ? Number(total) : undefined,
        due: due !== undefined ? Number(due) : undefined,
        description: description || undefined,
        paymentType: paymentType || undefined,
        
       
        items: items ? {
          deleteMany: {}, 
          create: items.map((item: any) => ({
            item_name: item.item_name,
            quantity: Number(item.quantity),
            unit: item.unit,
            price: Number(item.price),
          })),
        } : undefined,
      },
      include: { items: true },
    });

    return res.status(200).json(updatedInvoice);
  } catch (error: any) {
    console.error("Update Error:", error);
    if (error.code === 'P2025') return res.status(404).json({ message: "Invoice not found" });
    return res.status(500).json({ message: "Error updating invoice", error: error.message });
  }
};
export const deleteData = async (req: Request, res: Response) => {
  // Extract ID from the URL params (e.g., /app/delete/15)
  const { id } = req.params;

  try {
    // Because of 'onDelete: Cascade' in your schema,
    // this one command handles everything.
    const deletedInvoice = await prisma.invoice.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      success: true,
      message: `Invoice ${deletedInvoice.uid} and its items were deleted.`,
    });
  } catch (error: any) {
    // Prisma error code for "Record to delete does not exist"
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Invoice not found." });
    }

    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
