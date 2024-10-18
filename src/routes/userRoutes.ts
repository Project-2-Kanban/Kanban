import express from "express";
import userController from "../controllers/userController";
import authenticationVerify from "../middleware/authentication";
const router = express.Router();

router.get("/", authenticationVerify, userController.getUsers);
router.post("/", userController.createUser);
router.patch("/:id", authenticationVerify, userController.updateUser);
router.delete("/logout", authenticationVerify, userController.logoutUser);
router.delete("/:id", authenticationVerify, userController.deleteUser);
router.post("/login", userController.authenticateUser);

export default router;