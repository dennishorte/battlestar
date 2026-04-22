const card = require('./conflict-skirmish-3.js')

describe('conflict-skirmish-3', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-skirmish-3')
    expect(card.name).toBe('Skirmish')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(1)
  })
})
