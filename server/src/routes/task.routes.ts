import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma/client";
import {
  create,
  getOne,
  list,
  update,
  assignOwnerHandler,
  remove,
} from "../controllers/task.controller";

const router = Router();

router.use(authenticate);

router.post("/", create);

router.get("/", list);
router.get("/:id", getOne);
router.patch("/:id", update);
router.patch("/:id/owner", authorize(Role.ADMIN), assignOwnerHandler);
router.delete("/:id", remove);

export default router;
