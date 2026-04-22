const card = require('./sardaukar-canny.js')

describe('Sardaukar: Canny', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-canny')
    expect(card.name).toBe('Canny')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Bloodlines')
  })
})
