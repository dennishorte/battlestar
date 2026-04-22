'use strict'

const card = require('./windtraps.js')

describe('Windtraps', () => {
  test('card data', () => {
    expect(card.id).toBe('windtraps')
    expect(card.name).toBe('Windtraps')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(2)
  })
})
