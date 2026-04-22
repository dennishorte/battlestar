const card = require('./conflict-secure-imperial-basin-uprising.js')

describe('conflict-secure-imperial-basin-uprising', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-secure-imperial-basin-uprising')
    expect(card.name).toBe('Secure Imperial Basin')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
