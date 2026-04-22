const card = require('./heighliner-3.js')

describe('Heighliner (contract) [heighliner-3]', () => {
  test('data', () => {
    expect(card.id).toBe('heighliner-3')
    expect(card.name).toBe('Heighliner')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
