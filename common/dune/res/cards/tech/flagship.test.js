'use strict'

const card = require('./flagship.js')

describe('Flagship', () => {
  test('card data', () => {
    expect(card.id).toBe('flagship')
    expect(card.name).toBe('Flagship')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(8)
  })
})
