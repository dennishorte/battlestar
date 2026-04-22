'use strict'

const card = require('./troop-transports.js')

describe('Troop Transports', () => {
  test('card data', () => {
    expect(card.id).toBe('troop-transports')
    expect(card.name).toBe('Troop Transports')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Shipping (Rise of Ix)')
    expect(card.spiceCost).toBe(2)
  })
})
