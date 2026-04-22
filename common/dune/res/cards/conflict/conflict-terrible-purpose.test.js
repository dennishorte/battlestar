const card = require('./conflict-terrible-purpose.js')

describe('conflict-terrible-purpose', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-terrible-purpose')
    expect(card.name).toBe('Terrible Purpose')
    expect(card.source).toBe('Base')
    expect(card.compatibility).toBe('Base')
    expect(card.tier).toBe(2)
  })
})
