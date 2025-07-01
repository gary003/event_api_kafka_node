import { producer } from './initMQ'
import { randomUUID } from 'node:crypto'

const delay = 10000

export async function runProducer() {
  await producer.connect()

  while(true){
    const newMessage = fetchAndCreateFakeMessage()
    
    const topic = 'astronomy'
    
    try {
      const eventMessage = {
        topic,
        messages: [{ value: JSON.stringify(newMessage) }],
        publishDate: Date.now()
      }

      await producer.send(eventMessage)

      // console.info(`Published event to topic ${topic}`)
    } catch (error) {
      console.error(`Failed to publish event to ${topic}:`, error)
      await producer.disconnect()
      throw error
    }

    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

export const fetchAndCreateFakeMessage = () => {
  const spaceBodies = ['nova', 'black hole', 'star', 'comet', 'dwarf']

  const planetsCount = Math.floor(Math.random() * 1000)
  
  const planetIndex = Math.floor(Math.random() * spaceBodies.length)

  const body = `Found in picture - ${planetsCount} ${spaceBodies[planetIndex]}(s)`

  return {
    key: randomUUID(),
    value: body,
    topic: 'astronomy',
    timestamp: new Date().toISOString()
  }
}
