'use strict'

const card = require('./suspensor-suits.js')

describe('Suspensor Suits', () => {
  test('card data', () => {
    expect(card.id).toBe('suspensor-suits')
    expect(card.name).toBe('Suspensor Suits')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(3)
  })
})
