'use strict'

const card = require('./holtsman-engine.js')

describe('Holtsman Engine', () => {
  test('card data', () => {
    expect(card.id).toBe('holtsman-engine')
    expect(card.name).toBe('Holtsman Engine')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(6)
  })
})
