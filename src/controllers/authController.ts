import { Request, Response } from 'express';
import User from '../models/userModel';
import {signAccessToken} from "../services/tokenService";
import {AuthRequest} from "../middlewares/requireAuth";

export const register = async(req: Request, res: Response) => {
    try {
        const { email, password} = req.body;
        if ( !email || !password) {
            return res.status(400).json({error: 'Email and password are required'});
        }
        const existingUser = await User.findOne({ email})
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const newUser = new User({ email, password });
        await newUser.save();
        const token = signAccessToken({
            sub: newUser.id,
            role: newUser.role as 'ADMIN' | 'USER',
            permissions: []
        })
        return res.status(201).json({token, user: { id:newUser.id, email: newUser.email, role: newUser.role, name: newUser.get('name') }});

    } catch (err) {
        console.error(err)
        res.status(400).json({error: 'Server error'});
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body ?? {}
        if (!email) {
            return res.status(400).json({ error: 'Email jest wymagany' })
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(409).json({ error: 'Email jest już zarejestrowany' })
        }
        return res.json({ message: 'Email jest dostępny' })
    } catch (err) {
        console.error('verifyEmail error:', err)
        return res.status(500).json({ error: 'Błąd serwera' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body ?? {}
        if (!email || !password) {
            return res.status(400).json({ error: 'Email i hasło są wymagane' })
        }``
        const user = await User.findOne({ email, isActive: { $ne: false } }).select('+password')
        if (!user) {
            return res.status(401).json({ error: 'Zły email lub hasło' })
        }
        const ok = await (user as any).comparePassword(password)
        if (!ok) {
            return res.status(401).json({ error: 'Zły email lub hasło' })
        }
        const token = signAccessToken({
            sub: user.id,
            role: user.role as 'ADMIN' | 'USER',

            permissions: []
        })

        return res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role, name: (user as any).name }
        })
    } catch (err) {
        console.error('login error:', err)
        return res.status(500).json({ error: 'Błąd serwera' })
    }
}

export const me = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.sub;
    const user = await User.findById(userId)
        .select('_id email role name permissions createdAt updatedAt')
    return res.json({user})

}

export const logout = async (req: Request, res: Response) => {
    try {
        res.json({ message: 'User logged out successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Server error' });
    }
}