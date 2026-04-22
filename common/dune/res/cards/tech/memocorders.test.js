'use strict'

const card = require('./memocorders.js')

describe('Memocorders', () => {
  test('card data', () => {
    expect(card.id).toBe('memocorders')
    expect(card.name).toBe('Memocorders')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(2)
  })
})
