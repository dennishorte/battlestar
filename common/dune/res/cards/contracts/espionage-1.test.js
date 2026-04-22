const card = require('./espionage-1.js')

describe('Espionage (contract) [espionage-1]', () => {
  test('data', () => {
    expect(card.id).toBe('espionage-1')
    expect(card.name).toBe('Espionage')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
