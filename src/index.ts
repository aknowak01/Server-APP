import dotenv from 'dotenv'
import path from 'path'
dotenv.config()

import app from './app'
import mongoose from 'mongoose'

/// Constants
const PORT = 5000
const MONGODB_URI = 'mongodb://127.0.0.1:27017/KropkaDB'

if(!MONGODB_URI){
    console.error('MongoDB URI is missing, please update .env file')
    process.exit(1)
}
async function bootstrap() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('Connected to MongoDB', MONGODB_URI)

        const server = app.listen(PORT, () => {
            console.log(`Server works on port: ${PORT}`)
        })

        server.on('error', (err: any) => {
            console.error('Error while starting server:', err)
            process.exit(1)
        })




// Graceful shutdown (opcjonalnie)
        process.on('SIGINT', () => {
            console.log('Closing Server...')
            server.close(() => process.exit(0))
        })
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
    }}

async function seedRoles() {
    const Role = mongoose.model('Role', new mongoose.Schema({ name: String }))
    const roles = ['ADMIN', 'USER', 'MODERATOR']

    for (const roleName of roles) {
        const roleExists = await Role.findOne({ name: roleName })
        if (!roleExists) {
            await Role.create({name: roleName})
            console.log(`Seeded role: ${roleName}`)

        }
    }
}
bootstrap()
seedRoles();