const card = require('./conflict-storms-in-the-south.js')

describe('conflict-storms-in-the-south', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-storms-in-the-south')
    expect(card.name).toBe('Storms in the South')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
