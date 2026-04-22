'use strict'

const card = require('./planetary-array.js')

describe('Planetary Array', () => {
  test('card data', () => {
    expect(card.id).toBe('planetary-array')
    expect(card.name).toBe('Planetary Array')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(2)
  })
})
