const card = require('./conflict-skirmish-ornithopter.js')

describe('conflict-skirmish-ornithopter', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-skirmish-ornithopter')
    expect(card.name).toBe('Skirmish')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(1)
  })
})
