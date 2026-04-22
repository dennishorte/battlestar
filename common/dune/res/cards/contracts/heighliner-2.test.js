const card = require('./heighliner-2.js')

describe('Heighliner (contract) [heighliner-2]', () => {
  test('data', () => {
    expect(card.id).toBe('heighliner-2')
    expect(card.name).toBe('Heighliner')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
