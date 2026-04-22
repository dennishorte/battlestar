'use strict'

const card = require('./detonation-devices.js')

describe('Detonation Devices', () => {
  test('card data', () => {
    expect(card.id).toBe('detonation-devices')
    expect(card.name).toBe('Detonation Devices')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(3)
  })
})
