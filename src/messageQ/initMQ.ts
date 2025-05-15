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
