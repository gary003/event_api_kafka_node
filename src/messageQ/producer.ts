import { producer } from './initMQ'

/**
 * Publish an event to a Kafka topic
 */
export const publishEvent = async (topic: string, message: string) => {
  try {
    const eventMessage = {
      topic,
      messages: [{ value: JSON.stringify(message) }],
      publishDate: Date.now()
    }

    await producer.connect()
    await producer.send(eventMessage)
    console.info(`Published event to topic ${topic}`)
  } catch (error) {
    console.error(`Failed to publish event to ${topic}:`, error)
    throw error
  } finally {
    await producer.disconnect()
  }
}
