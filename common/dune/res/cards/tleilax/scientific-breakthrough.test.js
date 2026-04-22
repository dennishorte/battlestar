const card = require('./scientific-breakthrough.js')

describe('Scientific Breakthrough', () => {
  test('data', () => {
    expect(card.id).toBe('scientific-breakthrough')
    expect(card.name).toBe('Scientific Breakthrough')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
