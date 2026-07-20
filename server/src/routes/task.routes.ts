import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { create, getOne, list, update } from "../controllers/task.controller";

const router = Router();

router.use(authenticate);

router.post("/", create);

router.get("/", list);
router.get("/:id", getOne);
router.patch("/:id", update);

export default router;
