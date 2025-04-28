import { Kafka, Partitioners } from 'kafkajs'

// Initialize Kafka client
const kafka = new Kafka({
  clientId: 'event-api',
  brokers: [process.env.KAFKA_BROKERS || ''] // e.g., ['kafka:9092']
})

// Create producer with legacy partitioner to avoid warning
export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
})

// Create consumer
export const consumer = kafka.consumer({ groupId: 'event-group' })

/**
 * Publish an event to a Kafka topic
 */
export const publishEvent = async (topic: string, message: string) => {
  try {
    await producer.connect()
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    })
    console.info(`Published event to topic ${topic}`)
  } catch (error) {
    console.error(`Failed to publish event to ${topic}:`, error)
    throw error
  } finally {
    await producer.disconnect()
  }
}
