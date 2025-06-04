import { Readable } from 'node:stream'
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

const delay = 2000

export async function runProducer() {
  for await (const newMessage of fetchAndCreateFakeMessage()) {
    console.debug(newMessage)

    await publishEvent('astronomy', newMessage)

    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

export const fetchAndCreateFakeMessage = () => {
  const planetsArr = ['nova', 'black hole', 'star', 'comet', 'dwarf']
  // const planetsCount = Math.floor(Math.random() * 1000)

  // const planetIndex = Math.floor(Math.random() * planetsArr.length)

  // const data = `Found in picture - ${planetsCount} ${planetsArr[planetIndex]}(s)`

  const res = planetsArr.map((p, index) => {
    return {
      key: index,
      value: p,
      topic: 'astronomy',
      timestamp: new Date().toISOString()
    }
  })

  return Readable.from(res)
}
