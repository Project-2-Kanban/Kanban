import { Router } from "express";
import userRoutes from "./userRoutes";
import boardRoutes from "./boardRoutes";
import columnsRoutes from "./columnsRoutes";
import cardsRoutes from "./cardsRoutes";
const router = Router();

router.use("/user", userRoutes);
router.use("/board", boardRoutes);
router.use("/column", columnsRoutes);
router.use("/card", cardsRoutes);

export default router
