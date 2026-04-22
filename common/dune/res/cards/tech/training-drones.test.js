'use strict'

const card = require('./training-drones.js')

describe('Training Drones', () => {
  test('card data', () => {
    expect(card.id).toBe('training-drones')
    expect(card.name).toBe('Training Drones')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(3)
  })
})
