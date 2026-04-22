const card = require('./unnatural-reflexes.js')

describe('Unnatural Reflexes', () => {
  test('data', () => {
    expect(card.id).toBe('unnatural-reflexes')
    expect(card.name).toBe('Unnatural Reflexes')
    expect(card.source).toBe('Immortality')
    expect(card.compatibility).toBe('All')
  })
})
