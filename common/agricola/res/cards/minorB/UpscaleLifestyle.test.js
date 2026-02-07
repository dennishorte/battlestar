const res = require('../../index.js')

describe('Upscale Lifestyle (B001)', () => {
  test('gives 5 clay on play', () => {
    const card = res.getCardById('upscale-lifestyle-b001')
    expect(card.onPlay).toBeDefined()
    expect(card.cost).toEqual({ wood: 3 })
  })
})
