const card = require('./from-the-tanks.js')

describe('From the Tanks', () => {
  test('data', () => {
    expect(card.id).toBe('from-the-tanks')
    expect(card.name).toBe('From the Tanks')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
