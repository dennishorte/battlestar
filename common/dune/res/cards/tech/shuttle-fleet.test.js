'use strict'

const card = require('./shuttle-fleet.js')

describe('Shuttle Fleet', () => {
  test('card data', () => {
    expect(card.id).toBe('shuttle-fleet')
    expect(card.name).toBe('Shuttle Fleet')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(6)
  })
})
