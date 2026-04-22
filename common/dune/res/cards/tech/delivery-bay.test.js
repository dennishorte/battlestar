'use strict'

const card = require('./delivery-bay.js')

describe('Delivery Bay', () => {
  test('card data', () => {
    expect(card.id).toBe('delivery-bay')
    expect(card.name).toBe('Delivery Bay')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(3)
  })
})
