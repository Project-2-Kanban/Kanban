import express from "express";
import boardController from "../controllers/boardController";
import authenticationVerify from "../middleware/authentication";
const router = express.Router();

router.get("/:id", authenticationVerify, boardController.getBoard);
//router.get("/myBoards", authenticationVerify, boardController.getBoardsByUser);
router.post("/create", authenticationVerify, boardController.createBoard);
//router.post("/addMember/:idBoard", authenticationVerify, boardController.addMember);

export default router;