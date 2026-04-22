'use strict'

const card = require('./training-depot.js')

describe('Training Depot', () => {
  test('card data', () => {
    expect(card.id).toBe('training-depot')
    expect(card.name).toBe('Training Depot')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(1)
  })
})
