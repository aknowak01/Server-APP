import express, {Application, ErrorRequestHandler} from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

import authRoutes from "./routes/authRoutes";

const app: Application = express()


/// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())

/// Routes
app.get('/health', (_req, res)=> res.json({ok: true}))
app.get('/', (_req, res) => res.send('Api works 🚀!'))
app.use('/api/auth', authRoutes);

/// 404 Handler
app.use((_req, res) =>{
    res.status(404).json({error: 'Site not found'})
})

/// Global Error Handler
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err)
    res.status(err.status || 500).json({ error: err.message || 'Błąd serwera' })
}
app.use(errorHandler)


export default app