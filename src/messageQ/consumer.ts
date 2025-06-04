import { consumer } from './initMQ'

const delay = 2000

export const runConsumer = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic: 'astronomy', fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      // // Database save
      //   await EventModel.create({
      //     type: eventData.type,
      //     data: eventData.data,
      //     source: eventData.source || 'kafka'
      //   })

      console.info(`Processed event: astronomy ; message : ${String(message)} on topic`)
    }
  })

  await new Promise((resolve) => setTimeout(resolve, delay))
}

// Handle consumer shutdown
process.on('SIGTERM', async () => {
  console.info('Disconnecting Kafka consumer...')
  await consumer.disconnect()
  console.info('Kafka consumer disconnected')
})
