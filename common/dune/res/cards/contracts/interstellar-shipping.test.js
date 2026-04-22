const card = require('./interstellar-shipping.js')

describe('Interstellar Shipping (contract)', () => {
  test('data', () => {
    expect(card.id).toBe('interstellar-shipping')
    expect(card.name).toBe('Interstellar Shipping')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
