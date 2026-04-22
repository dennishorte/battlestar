const card = require('./conflict-protect-the-sietches.js')

describe('conflict-protect-the-sietches', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-protect-the-sietches')
    expect(card.name).toBe('Protect the Sietches')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
