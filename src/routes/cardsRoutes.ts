import express from "express";
import cardsController from "../controllers/cardsController";
import authenticationVerify from "../middleware/authentication";
const router = express.Router();

router.get("/get/:id", authenticationVerify, cardsController.getCard);
router.post("/create", authenticationVerify, cardsController.createCard);
router.delete("/:cards_id", authenticationVerify, cardsController.deleteCard);
router.get("/membersInCards/:cards_id", authenticationVerify, cardsController.getMembersByCard);
router.get("/myCards", authenticationVerify, cardsController.getCardsByUser);
router.post("/addMemberCard/:idCards", authenticationVerify, cardsController.addMemberCard);
router.delete("/removeMemberCard/:idCards/:idMember", authenticationVerify, cardsController.removeMemberCard);

export default router;