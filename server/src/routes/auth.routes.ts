import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
  adminCheck,
  listUsersHandler,
} from "../controllers/auth.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma/client";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", authenticate, me);
router.get("/admin-check", authenticate, authorize(Role.ADMIN), adminCheck);
router.get("/users", authenticate, authorize(Role.ADMIN), listUsersHandler);

export default router;
