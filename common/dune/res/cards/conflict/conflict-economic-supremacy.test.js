const card = require('./conflict-economic-supremacy.js')

describe('Economic Supremacy', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-economic-supremacy')
    expect(card.name).toBe('Economic Supremacy')
    expect(card.source).toBe('Rise of Ix')
    expect(card.tier).toBe(3)
    expect(card.epicOnly).toBe(true)
  })
})
