import { Request, Response,NextFunction } from  "express";
import {JwtPayload} from "jsonwebtoken";
import {verifyAccessToken} from "../services/tokenService";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if(!header?.startsWith('Bearer')) {
        return res.status(401).send("Not authorized")
    }
    const token = header.slice(7)
    try {
        req.user =  verifyAccessToken(token)
        return next();
    } catch {
        return res.status(401).send("Bad Token or expired")
    }
}