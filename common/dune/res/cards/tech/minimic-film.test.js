'use strict'

const card = require('./minimic-film.js')

describe('Minimic Film', () => {
  test('card data', () => {
    expect(card.id).toBe('minimic-film')
    expect(card.name).toBe('Minimic Film')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(2)
  })
})
