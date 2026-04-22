'use strict'

const card = require('./servo-receivers.js')

describe('Servo-Receivers', () => {
  test('card data', () => {
    expect(card.id).toBe('servo-receivers')
    expect(card.name).toBe('Servo-Receivers')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(2)
  })
})
