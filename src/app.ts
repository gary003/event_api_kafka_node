import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import eventRoutes from './routes/eventRoutes'

// Load environment variables
dotenv.config()

// Initialize Express app
const app: Application = express()

// Middleware
app.use(helmet()) // Security headers
app.use(cors()) // Enable CORS for cross-origin requests
app.use(express.json()) // Parse JSON bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

// Routes
app.use('/api/events', eventRoutes) // Event-related endpoints

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() })
})

// Handle 404 errors
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' })
})

export default app
