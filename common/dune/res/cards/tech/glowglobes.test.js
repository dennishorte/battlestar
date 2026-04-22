'use strict'

const card = require('./glowglobes.js')

describe('Glowglobes', () => {
  test('card data', () => {
    expect(card.id).toBe('glowglobes')
    expect(card.name).toBe('Glowglobes')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(2)
  })
})
