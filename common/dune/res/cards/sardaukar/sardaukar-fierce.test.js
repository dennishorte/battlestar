const card = require('./sardaukar-fierce.js')

describe('Sardaukar: Fierce', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-fierce')
    expect(card.name).toBe('Fierce')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Bloodlines')
  })
})
