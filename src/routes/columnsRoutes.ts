import express from "express";
import columnsController from "../controllers/columnsControllers";
import authenticationVerify from "../middleware/authentication";
const router = express.Router();

router.get("/get/:id", authenticationVerify, columnsController.getColumn);
router.get("/get/all/:board_id", authenticationVerify, columnsController.getAllColumns);
router.post("/create/:board_id", authenticationVerify, columnsController.createColumn);
router.delete("/:board_id/:column_id", authenticationVerify, columnsController.deleteColumn);

export default router;