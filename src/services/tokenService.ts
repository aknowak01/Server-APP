import jwt from 'jsonwebtoken'

export interface JwtPayLoad {
    sub: string
    role: 'ADMIN' | 'USER'
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