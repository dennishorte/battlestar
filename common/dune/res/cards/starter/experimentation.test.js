const card = require('./experimentation.js')

describe('Experimentation', () => {
  test('data', () => {
    expect(card.id).toBe('experimentation')
    expect(card.name).toBe('Experimentation')
    expect(card.source).toBeDefined()
    expect(card.compatibility).toBeDefined()
  })
})
