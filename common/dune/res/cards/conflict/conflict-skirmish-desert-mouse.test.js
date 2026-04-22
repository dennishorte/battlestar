const card = require('./conflict-skirmish-desert-mouse.js')

describe('conflict-skirmish-desert-mouse', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-skirmish-desert-mouse')
    expect(card.name).toBe('Skirmish')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(1)
  })
})
