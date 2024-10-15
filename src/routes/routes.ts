import { Router } from "express";
import userRoutes from "./userRoutes";
import boardRoutes from "./boardRoutes";
import columnsRoutes from "./columnsRoutes";
const router = Router();

router.use("/user", userRoutes);
router.use("/board", boardRoutes);
router.use("/column", columnsRoutes);

export default router
