const card = require('./industrial-espionage.js')

describe('Industrial Espionage', () => {
  test('data', () => {
    expect(card.id).toBe('industrial-espionage')
    expect(card.name).toBe('Industrial Espionage')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
