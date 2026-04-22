const card = require('./arrakis-liason.js')

describe('Arrakis Liason', () => {
  test('data', () => {
    expect(card.id).toBe('arrakis-liason')
    expect(card.name).toBe('Arrakis Liason')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Dune Imperium (Base Only)')
  })
})
