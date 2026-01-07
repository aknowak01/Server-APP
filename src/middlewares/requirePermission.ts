import {AuthRequest} from "./requireAuth";
import {Response, NextFunction} from "express";
import User from '../models/userModel'
import { Role } from '../models/roleModels'

export function requirePermission(...perms: string[]) {
    return async (req: AuthRequest, res: Response, next: NextFunction)=> {
        if (!req.user || !req.userId) return res.status(401).json({error: 'Unauthorized'})

        const dbUser = await User.findById(req.userId).select('permissions role')
        if (!dbUser) return res.status(401).json({error: 'Unauthorized'})

        if (dbUser.role === Role.ADMIN) return next()

        const hasall = perms.every(p => dbUser.permissions.includes(p))

        if (!hasall) return res.status(401).json({error: 'Unauthorized'})
        next()
    }
}
