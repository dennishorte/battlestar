'use strict'

const card = require('./sonic-snoopers.js')

describe('Sonic Snoopers', () => {
  test('card data', () => {
    expect(card.id).toBe('sonic-snoopers')
    expect(card.name).toBe('Sonic Snoopers')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(2)
  })
})
