import express from "express";
import boardController from "../controllers/boardController";
import authenticationVerify from "../middleware/authentication";
const router = express.Router();

router.get("/get/:id", authenticationVerify, boardController.getBoard);
router.get("/getColumnsAndCards/:board_id", authenticationVerify, boardController.getColumnsAndCardsByBoard);
router.post("/create", authenticationVerify, boardController.createBoard);
router.delete("/:board_id", authenticationVerify, boardController.deleteBoard);
router.get("/membersInBoard/:board_id", authenticationVerify, boardController.getMembersByBoard);
router.get("/myBoards", authenticationVerify, boardController.getBoardsMyUser);
router.post("/addMember/:idBoard", authenticationVerify, boardController.addMember);
router.delete("/removeMember/:idBoard/:idMember", authenticationVerify, boardController.removeMember);

export default router;