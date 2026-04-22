'use strict'

const card = require('./chaumurky.js')

describe('Chaumurky', () => {
  test('card data', () => {
    expect(card.id).toBe('chaumurky')
    expect(card.name).toBe('Chaumurky')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(4)
  })
})
