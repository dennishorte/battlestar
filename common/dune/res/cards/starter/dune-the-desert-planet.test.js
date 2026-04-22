const card = require('./dune-the-desert-planet.js')

describe('Dune, The Desert Planet', () => {
  test('data', () => {
    expect(card.id).toBe('dune-the-desert-planet')
    expect(card.name).toBe('Dune, The Desert Planet')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
