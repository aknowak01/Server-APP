import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middlewares/requireAuth'
import { requireRole } from '../middlewares/requireRole'

const router = Router()

router.get('/overview', requireAuth, requireRole('ADMIN'), (req: AuthRequest, res: Response) => {
    res.json({
        message: 'Panel administratora — dostęp przyznany ✅',
        user: req.user,
    })
})

export default router
