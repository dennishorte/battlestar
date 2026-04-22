'use strict'

const card = require('./plasteel-blades.js')

describe('Plasteel Blades', () => {
  test('card data', () => {
    expect(card.id).toBe('plasteel-blades')
    expect(card.name).toBe('Plasteel Blades')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Bloodlines')
    expect(card.spiceCost).toBe(3)
  })
})
