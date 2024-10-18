import express from "express";
import columnsController from "../controllers/columnsControllers";
import authenticationVerify from "../middleware/authentication";
const router = express.Router();

router.get("/get/:id", authenticationVerify, columnsController.getColumn);
router.post("/create", authenticationVerify, columnsController.createColumn);
router.put("/update/:id", authenticationVerify, columnsController.updateColumn);
router.delete("/:board_id/:column_id", authenticationVerify, columnsController.deleteColumn);

export default router;