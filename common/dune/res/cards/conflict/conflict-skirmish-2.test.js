const card = require('./conflict-skirmish-2.js')

describe('conflict-skirmish-2', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-skirmish-2')
    expect(card.name).toBe('Skirmish')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(1)
  })
})
