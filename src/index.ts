import dotenv from 'dotenv'
dotenv.config()

import app from './app'

const PORT = parseInt(process.env.DEV_PORT || '', 10) || 3000

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
