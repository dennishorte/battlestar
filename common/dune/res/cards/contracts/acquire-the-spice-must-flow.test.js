const card = require('./acquire-the-spice-must-flow.js')

describe('Acquire The Spice Must Flow (contract)', () => {
  test('data', () => {
    expect(card.id).toBe('acquire-the-spice-must-flow')
    expect(card.name).toBe('Acquire The Spice Must Flow')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
  })
})
