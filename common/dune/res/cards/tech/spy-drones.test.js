'use strict'

const card = require('./spy-drones.js')

describe('Spy Drones', () => {
  test('card data', () => {
    expect(card.id).toBe('spy-drones')
    expect(card.name).toBe('Spy Drones')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spiceCost).toBe(5)
  })
})
