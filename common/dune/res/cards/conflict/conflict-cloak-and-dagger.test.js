const card = require('./conflict-cloak-and-dagger.js')

describe('conflict-cloak-and-dagger', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-cloak-and-dagger')
    expect(card.name).toBe('Cloak and Dagger')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
