import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middlewares/requireAuth'
import { requireRole } from '../middlewares/requireRole'
import { Role } from '../models/roleModels'
import { requirePermission } from '../middlewares/requirePermission'
import User from '../models/userModel'

const router = Router()

router.get('/overview', requireAuth, requireRole(Role.ADMIN), (req: AuthRequest, res: Response) => {
    res.json({
        message: 'Panel administratora — dostęp przyznany ✅',
        user: req.user,
    })
})

router.post('/permissions/grant', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
    const { userId, permission } = req.body
    if (!userId || !permission) return res.status(400).json({ error: 'Brak danych wejściowych' })
    await User.updateOne({ _id: userId }, { $addToSet: { permissions: permission } })
    res.json({ message: 'Granted', userId, permission })
})

router.post('/permissions/revoke', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
    const { userId, permission } = req.body
    if (!userId || !permission) return res.status(400).json({ error: 'Brak danych wejściowych' })
    await User.updateOne({ _id: userId }, { $pull: { permissions: permission } })
    res.json({ message: 'Revoked', userId, permission })
})

router.get('/permissions/user/:id', requireAuth, requireRole(Role.ADMIN), async (req, res) => {
    const user = await User.findById(req.params.id).select('_id email role permissions')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
})

router.patch('/test-secured', requireAuth, requirePermission('orders.edit'), (req: AuthRequest, res: Response) => {
    res.json({ message: 'Zabezpieczona trasa działa ✅', user: req.user })
})

export default router
