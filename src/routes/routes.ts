import { Router } from "express";
import userRoutes from "./userRoutes";
import boardRoutes from "./boardRoutes";
const router = Router();

router.use("/user", userRoutes);
router.use("/board", boardRoutes);

export default router
