const card = require('./smuggling.js')

describe('Smuggling (contract)', () => {
  test('data', () => {
    expect(card.id).toBe('smuggling')
    expect(card.name).toBe('Smuggling')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
