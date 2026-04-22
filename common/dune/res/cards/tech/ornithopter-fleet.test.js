'use strict'

const card = require('./ornithopter-fleet.js')

describe('Ornithopter Fleet', () => {
  test('card data', () => {
    expect(card.id).toBe('ornithopter-fleet')
    expect(card.name).toBe('Ornithopter Fleet')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spiceCost).toBe(4)
  })
})
