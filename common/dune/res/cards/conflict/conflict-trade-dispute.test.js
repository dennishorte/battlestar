const card = require('./conflict-trade-dispute.js')

describe('conflict-trade-dispute', () => {
  test('data', () => {
    expect(card.id).toBe('conflict-trade-dispute')
    expect(card.name).toBe('Trade Dispute')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('Uprising')
    expect(card.tier).toBe(2)
  })
})
