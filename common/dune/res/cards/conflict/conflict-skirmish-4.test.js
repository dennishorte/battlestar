const card = require('./conflict-skirmish-4.js')

describe('conflict-skirmish-4', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-skirmish-4')
    expect(card.name).toBe('Skirmish')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(1)
  })
})
