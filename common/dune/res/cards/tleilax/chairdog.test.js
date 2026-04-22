const card = require('./chairdog.js')

describe('Chairdog', () => {
  test('data', () => {
    expect(card.id).toBe('chairdog')
    expect(card.name).toBe('Chairdog')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
