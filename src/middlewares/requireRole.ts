import { Response, NextFunction } from 'express'
import { AuthRequest } from './requireAuth'

export function requireRole(...roles: Array<'ADMIN' | 'USER'>) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Brak autoryzacji' })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Brak uprawnień do tej operacji' })
        }

        next()
    }
}
