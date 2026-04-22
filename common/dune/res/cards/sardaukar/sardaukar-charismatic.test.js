const card = require('./sardaukar-charismatic.js')

describe('Sardaukar: Charismatic', () => {
  test('data', () => {
    expect(card.id).toBe('sardaukar-charismatic')
    expect(card.name).toBe('Charismatic')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Bloodlines')
  })
})
