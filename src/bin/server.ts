import http from 'http'
import app from '../app'

import { producer } from '../messageQ/initMQ'
import { runConsumer } from '../messageQ/consumer'
import { runProducer } from '../messageQ/producer'

// Create HTTP server
const server = http.createServer(app)
const port = process.env.PORT || '3000'

// Check Kafka connectivity by connecting producer and sending a test message
const checkKafkaConnectivity = async () => {
  try {
    await producer.connect()
    // Optional: Send a test message to ensure topic creation and broker readiness
    await producer.send({
      topic: 'test-connectivity',
      messages: [{ value: JSON.stringify({ test: 'ping' }) }]
    })
    console.info('Kafka broker is fully reachable and operational')
    await producer.disconnect()
    return true
  } catch (error) {
    console.error('Kafka broker not reachable:', error)
    return false
  }
}

// Start Kafka consumer with retry and connectivity check
const startConsumerWithRetry = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const kafkaReady = await checkKafkaConnectivity()
    if (kafkaReady) {
      try {
        console.info('Starting Kafka consumer...')
        await runConsumer()
        console.info('Kafka consumer started successfully')
        return
      } catch (err) {
        console.error(`Failed to start Kafka consumer: ${err}`)
      }
    } else {
      console.warn('Kafka not fully ready yet')
    }

    if (attempt === retries) {
      console.error('Max retries reached. Exiting...')
      process.exit(1)
    }

    console.info(`Retrying in ${delay / 1000} seconds...`)
    
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

// Add this new function
const startProducerWithRetry = async (retries = 5, delay = 5000) => {
  // Create an async iterator for the attempts
  const attempts = Array(retries).fill(0).map((_, index) => index +1)

  for await (const attempt of attempts) {
    console.info(`Connecting Kafka producer (attempt ${attempt}/${retries})`)
    const kafkaReady = await checkKafkaConnectivity()

    if (kafkaReady) {
      try {
        console.info('Starting Kafka producer...')
        await runProducer() // Your producer initialization logic
        console.info('Kafka producer started successfully')
        return
      } catch (err) {
        console.error(`Failed to start Kafka producer: ${err}`)
      }
    }

    if (attempt === retries) {
      console.error('Max producer retries reached')
      throw new Error('Kafka producer initialization failed')
    }

    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

// Start server and consumer
const startServer = async () => {
  try {
    server.listen(port)

    await startConsumerWithRetry()

    await startProducerWithRetry()
  } catch (err) {
    console.error('Unexpected error starting server:', err)
    process.exit(1)
  }
}

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  if (error.code === 'EACCES') {
    console.error(`${bind} requires elevated privileges`)
    process.exit(1)
  } else if (error.code === 'EADDRINUSE') {
    console.error(`${bind} is already in use`)
    process.exit(1)
  } else {
    throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`
  console.info(`Server listening on ${bind}`)
}

/**
 * Graceful shutdown handler
 */
const shutdown = (signal: string) => {
  console.info(`Received ${signal}. Shutting down gracefully...`)
  server.close(() => {
    console.info('HTTP server closed.')
    process.exit(0)
  })

  producer.disconnect()

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}

server.on('error', onError)
server.on('listening', onListening)

// Handle graceful shutdown
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

startServer()
