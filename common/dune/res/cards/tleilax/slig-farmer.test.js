const card = require('./slig-farmer.js')

describe('Slig Farmer', () => {
  test('data', () => {
    expect(card.id).toBe('slig-farmer')
    expect(card.name).toBe('Slig Farmer')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
