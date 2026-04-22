'use strict'

const card = require('./artillery.js')

describe('Artillery', () => {
  test('card data', () => {
    expect(card.id).toBe('artillery')
    expect(card.name).toBe('Artillery')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(1)
  })
})
