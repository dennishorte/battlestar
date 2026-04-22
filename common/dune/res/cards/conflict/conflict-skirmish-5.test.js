const card = require('./conflict-skirmish-5.js')

describe('conflict-skirmish-5', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-skirmish-5')
    expect(card.name).toBe('Skirmish')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('All')
    expect(card.tier).toBe(1)
  })
})
