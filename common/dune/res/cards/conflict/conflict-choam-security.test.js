const card = require('./conflict-choam-security.js')

describe('conflict-choam-security', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-choam-security')
    expect(card.name).toBe('CHOAM Security')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
