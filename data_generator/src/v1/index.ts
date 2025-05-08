import { setTimeout } from 'timers/promises'

const REQUEST_INTERVAL = 6000; // 20 seconds between requests (CoinCap allows 10-30 RPM)

let lastRequestTime = 0

const fetchWithRateLimit = async () => {
  const planetsArr = ["nova", "black hole", "star", "comet", "dwarf"]
  const planetsCount = Math.floor(Math.random() * 1000)

  try {

    const planetIndex = Math.floor(Math.random() * planetsArr.length)
    const data  = `Found in picture - ${planetsCount} ${planetsArr[planetIndex]}(s)`

    return {
      data,
      timestamp: Date.now()
    }

  } catch (error) {
    console.error('API Error:', error instanceof Error ? error.message : String(error))
    return null
  }
}

const run = async () => {

  while (true) {

    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
  
    // Enforce rate limiting
    if (timeSinceLastRequest < REQUEST_INTERVAL) {
      const waitTime = REQUEST_INTERVAL - timeSinceLastRequest
      await setTimeout(waitTime)
    }

    const response = await fetchWithRateLimit()
    
    lastRequestTime = Number(response?.timestamp)

    if (response) {
      console.log(`Astronomy - ${response.data}`)

      // Add your Kafka producer logic here:
      // await producer.send({...});
    }

    await setTimeout(REQUEST_INTERVAL)
  }
}

run().catch(console.error)