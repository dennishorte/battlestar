const card = require('./beguiling-pheromones.js')

describe('Beguiling Pheromones', () => {
  test('data', () => {
    expect(card.id).toBe('beguiling-pheromones')
    expect(card.name).toBe('Beguiling Pheromones')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
