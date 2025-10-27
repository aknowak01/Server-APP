import express from "express";
import {register, login, logout, me} from "../controllers/authController";
import {requireAuth} from "../middlewares/requireAuth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me",requireAuth, me);

export default router;

