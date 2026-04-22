'use strict'

const card = require('./spaceport.js')

describe('Spaceport', () => {
  test('card data', () => {
    expect(card.id).toBe('spaceport')
    expect(card.name).toBe('Spaceport')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(5)
  })
})
