const card = require('./reconnaissance.js')

describe('Reconnaissance', () => {
  test('data', () => {
    expect(card.id).toBe('reconnaissance')
    expect(card.name).toBe('Reconnaissance')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
