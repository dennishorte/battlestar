const card = require('./tech-negotiation.js')

describe('Tech Negotiation (contract)', () => {
  test('data', () => {
    expect(card.id).toBe('tech-negotiation')
    expect(card.name).toBe('Tech Negotiation')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
