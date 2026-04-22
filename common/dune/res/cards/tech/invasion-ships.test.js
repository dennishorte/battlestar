'use strict'

const card = require('./invasion-ships.js')

describe('Invasion Ships', () => {
  test('card data', () => {
    expect(card.id).toBe('invasion-ships')
    expect(card.name).toBe('Invasion Ships')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(5)
  })
})
