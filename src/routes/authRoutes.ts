import express from "express";
import {register, login, logout, me} from "../controllers/authController";
import {requireAuth} from "../middlewares/requireAuth";
import {requireRole} from "../middlewares/requireRole";
import { Role } from '../models/roleModels'

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me",requireAuth, me);
router.post( "/overwiev", requireRole(Role.ADMIN));

export default router;
