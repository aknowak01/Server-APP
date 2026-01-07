import jwt from 'jsonwebtoken'
import { Role } from '../models/roleModels'

export interface JwtPayLoad {
    sub: string
    role: Role
    permissions?: string[]
}

const SECRET = "dev_secret_cool_key"
const EXPIRES_IN =  '20m'

export function signAccessToken(payload: JwtPayLoad): string {
        return jwt.sign(payload, SECRET, {expiresIn: EXPIRES_IN} )
}

export function verifyAccessToken(token: string): JwtPayLoad {
    return jwt.verify(token, SECRET) as JwtPayLoad
}
