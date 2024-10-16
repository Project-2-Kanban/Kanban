import { Router, Request, Response } from "express";
import userRoutes from "./userRoutes";
import boardRoutes from "./boardRoutes";
import { ChatBot } from '../utils/ai-assistant';

const router = Router();

router.use("/user", userRoutes);
router.use("/board", boardRoutes);

router.post("/ai", async (req: Request, res: Response): Promise<void> => {
    try {
        const { query } = req.body;

        const response = await ChatBot(query);

        res.status(200).json({ data: response, error: null });
    } catch (error) {
        console.error("Erro ao chamar ChatBot:", error);
        res.status(500).json({ data: null, error: "Erro ao processar a solicitação" });
    }
});

export default router;