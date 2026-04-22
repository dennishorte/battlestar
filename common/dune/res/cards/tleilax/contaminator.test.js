const card = require('./contaminator.js')

describe('Contaminator', () => {
  test('data', () => {
    expect(card.id).toBe('contaminator')
    expect(card.name).toBe('Contaminator')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
