const card = require('./conflict-skirmish-crysknife.js')

describe('conflict-skirmish-crysknife', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-skirmish-crysknife')
    expect(card.name).toBe('Skirmish')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(1)
  })
})
