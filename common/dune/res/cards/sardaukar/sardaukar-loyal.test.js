const card = require('./sardaukar-loyal.js')

describe('Sardaukar: Loyal', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-loyal')
    expect(card.name).toBe('Loyal')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Bloodlines')
  })
})
