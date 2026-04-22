const card = require('./espionage-2.js')

describe('Espionage (contract) [espionage-2]', () => {
  test('data', () => {
    expect(card.id).toBe('espionage-2')
    expect(card.name).toBe('Espionage')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
