import { consumer } from './kafkaService'

export const runConsumer = async () => {
  try {
    await consumer.connect()
    await consumer.subscribe({ topic: 'event.created', fromBeginning: true })
    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const eventData = '{????????????????}' + message
          //   await EventModel.create({
          //     type: eventData.type,
          //     data: eventData.data,
          //     source: eventData.source || 'kafka'
          //   })
          console.info(`Processed event: ${eventData} ; message : ${message} on topic`)
        } catch (error) {
          console.error('Error processing message on topic -!!!!!!!!!!!!!!!!!!!!!!!!!!!:', error)
        }
      }
    })
  } catch (error) {
    console.error('Kafka consumer error:', error)
    throw error
  }
}

// Handle consumer shutdown
process.on('SIGTERM', async () => {
  console.info('Disconnecting Kafka consumer...')
  await consumer.disconnect()
  console.info('Kafka consumer disconnected')
})
