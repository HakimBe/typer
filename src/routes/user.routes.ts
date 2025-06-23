import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
} from "../controllers/user.controller";
import {
  authenticate,
  isAdmin,
  isOwnerOrAdmin,
} from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticate, isAdmin, getAllUsers);
router.get("/:id", authenticate, isOwnerOrAdmin, getUserById);
router.post("/", createUser);

export default router;
