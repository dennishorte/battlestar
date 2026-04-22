const card = require('./piter-genius-advisor.js')

describe('Piter, Genius Advisor', () => {
  test('data', () => {
    expect(card.id).toBe('piter-genius-advisor')
    expect(card.name).toBe('Piter, Genius Advisor')
    expect(card.source).toBe('Promo')
    expect(card.compatibility).toBe('All')
  })
})
