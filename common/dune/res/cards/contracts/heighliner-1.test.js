const card = require('./heighliner-1.js')

describe('Heighliner (contract) [heighliner-1]', () => {
  test('data', () => {
    expect(card.id).toBe('heighliner-1')
    expect(card.name).toBe('Heighliner')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
