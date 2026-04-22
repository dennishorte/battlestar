const card = require('./foldspace.js')

describe('Foldspace', () => {
  test('data', () => {
    expect(card.id).toBe('foldspace')
    expect(card.name).toBe('Foldspace')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Dune Imperium (Base Only)')
  })
})
