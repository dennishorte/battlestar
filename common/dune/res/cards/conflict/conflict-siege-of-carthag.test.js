const card = require('./conflict-siege-of-carthag.js')

describe('conflict-siege-of-carthag', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-siege-of-carthag')
    expect(card.name).toBe('Siege of Carthag')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
