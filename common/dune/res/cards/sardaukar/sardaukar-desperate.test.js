const card = require('./sardaukar-desperate.js')

describe('Sardaukar: Desperate', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-desperate')
    expect(card.name).toBe('Desperate')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Bloodlines')
  })
})
