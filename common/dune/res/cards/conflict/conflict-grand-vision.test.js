const card = require('./conflict-grand-vision.js')

describe('conflict-grand-vision', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-grand-vision')
    expect(card.name).toBe('Grand Vision')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(3)
  })
})
