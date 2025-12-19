import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayLoad } from "../services/tokenService";

export interface AuthRequest extends Request {
    user?: JwtPayLoad;
    userId?: string;
}

export function auth(req: Request, res: Response, next: NextFunction) {

    const auth = req.headers.authorization;

    if(!auth){
        return next();

    } else {
        const [scheme, token] = auth.split(" ");
        if (scheme !== "Bearer" || !token) {
            return next();
        }


        try {
            const payload = verifyAccessToken(token);
            (req as AuthRequest).user = payload;
            (req as AuthRequest).userId = payload.sub;
            return next();
        } catch {
            return next();
        }

    }

}

export function clearAuth(req: AuthRequest, res: Response, next: NextFunction) {
    delete req.user;
    delete req.userId;
    return next();
}



export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Brak nagłówka Authorization" });

    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Zły format nagłówka Authorization (Bearer <token>)" });
    }

    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        req.userId = payload.sub;
        return next();
    } catch {
        return res.status(401).json({ error: "Nieprawidłowy lub wygasły token" });
    }
}
