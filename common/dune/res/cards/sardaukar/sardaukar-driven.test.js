const card = require('./sardaukar-driven.js')

describe('Sardaukar: Driven', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-driven')
    expect(card.name).toBe('Driven')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Bloodlines')
  })
})
