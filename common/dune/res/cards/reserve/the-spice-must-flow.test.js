const card = require('./the-spice-must-flow.js')

describe('The Spice Must Flow', () => {
  test('data', () => {
    expect(card.id).toBe('the-spice-must-flow')
    expect(card.name).toBe('The Spice Must Flow')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
