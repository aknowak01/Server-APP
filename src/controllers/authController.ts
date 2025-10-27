import { Request, Response } from 'express';
import User from '../models/userModel';
import {signAccessToken} from "../services/tokenService";

export const register = async(req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
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

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if ( !email || !password) return res.status(400).json({error: 'Email and password are required'});
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = signAccessToken({
            sub: user.id,
            role: user.role as 'ADMIN' | 'USER',
            permissions: []
        });
        res.json({token, user: user.id, email: user.email, role: user.role, name: user.get('name') });
    } catch (err) {
        res.status(400).json({error: 'Server error'});
    }
}

export const me = async (req: Request, res: Response) => {
    const { user } = req as any
    if(!user) return res.status(401).json({error: 'Unauthorized'});
    return res.json({ user })
}



export const logout = async (req: Request, res: Response) => {
    try {
        // Implement logout logic if using sessions or tokens
        res.json({ message: 'User logged out successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Server error' });
    }
}