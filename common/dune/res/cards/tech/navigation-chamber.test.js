'use strict'

const card = require('./navigation-chamber.js')

describe('Navigation Chamber', () => {
  test('card data', () => {
    expect(card.id).toBe('navigation-chamber')
    expect(card.name).toBe('Navigation Chamber')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(5)
  })
})
