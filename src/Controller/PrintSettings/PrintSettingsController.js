import { prisma } from "../../lib/prisma";
// Save/update layout
// export const printOption = async (req: any, res: Response) => {
//   try {
//      const userId = Number(req.query.userId); 
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });
//     const layout = req.body.layout;
//     if (!layout || typeof layout !== "string") 
//       return res.status(400).json({ message: "Layout is required" });
//     const user = await prisma.user.update({
//       where: { id: userId },
//       data: { printLayout: layout },
//     });
//     res.json({ layout: user.printLayout });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
// // Fetch layout
// export const PrintFind = async (req: any, res: Response) => {
//   try {
//    const userId = Number(req.query.userId); 
//     if (!userId) return res.status(401).json({ message: "Unauthorized" });
//     const user = await prisma.user.findUnique({
//     where: { id: userId },
//       select: { printLayout: true }, // correct case
//     });
//     res.json({ layout: user?.printLayout || "1" }); // correct case
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ layout: "1" });
//   }
// };
export const printSelect = async (req, res) => {
    try {
        const userId = Number(req.query.userId);
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { layout } = req.body;
        if (!layout || typeof layout !== "string") {
            return res.status(400).json({ message: "Layout is required" });
        }
        await prisma.user.update({
            where: { id: userId },
            data: { printLayout: layout },
        });
        res.json({ message: "Saved" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
