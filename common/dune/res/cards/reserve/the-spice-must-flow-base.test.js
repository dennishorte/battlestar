const card = require('./the-spice-must-flow-base.js')

describe('The Spice Must Flow (Base)', () => {
  test('data', () => {
    expect(card.id).toBe('the-spice-must-flow-base')
    expect(card.name).toBe('The Spice Must Flow (Base)')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Dune Imperium (Base Only)')
  })
})
