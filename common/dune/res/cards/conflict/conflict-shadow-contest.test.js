const card = require('./conflict-shadow-contest.js')

describe('conflict-shadow-contest', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-shadow-contest')
    expect(card.name).toBe('Shadow Contest')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
