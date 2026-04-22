'use strict'

const card = require('./spy-satellites.js')

describe('Spy Satellites', () => {
  test('card data', () => {
    expect(card.id).toBe('spy-satellites')
    expect(card.name).toBe('Spy Satellites')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(4)
  })
})
