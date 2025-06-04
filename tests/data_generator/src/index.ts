export const fetchWithRateLimit = async () => {
  const planetsArr = ['nova', 'black hole', 'star', 'comet', 'dwarf']
  const planetsCount = Math.floor(Math.random() * 1000)

  const planetIndex = Math.floor(Math.random() * planetsArr.length)
  const data = `Found in picture - ${planetsCount} ${planetsArr[planetIndex]}(s)`

  return {
    data,
    timestamp: Date.now()
  }
}
