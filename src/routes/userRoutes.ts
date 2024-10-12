import express from "express";
import userController from "../controllers/userController";
import permissionVerify from "../middleware/authentication";
const router = express.Router();

// router.get("/", permissionVerify, userController.getUsers);
router.post("/", userController.createUser);
// router.patch("/:id", permissionVerify, userController.updateUser);
// router.delete("/logout", permissionVerify, userController.logoutUser);
// router.delete("/:id", permissionVerify, userController.deleteUser);
router.post("/login", userController.authenticateUser);

export default router;