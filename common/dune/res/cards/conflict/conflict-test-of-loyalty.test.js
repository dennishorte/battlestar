const card = require('./conflict-test-of-loyalty.js')

describe('conflict-test-of-loyalty', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-test-of-loyalty')
    expect(card.name).toBe('Test of Loyalty')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
