const card = require('./control-the-spice.js')

describe('Control the Spice', () => {
  test('data', () => {
    expect(card.id).toBe('control-the-spice')
    expect(card.name).toBe('Control the Spice')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
