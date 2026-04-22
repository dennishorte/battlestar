'use strict'

const card = require('./forbidden-weapons.js')

describe('Forbidden Weapons', () => {
  test('card data', () => {
    expect(card.id).toBe('forbidden-weapons')
    expect(card.name).toBe('Forbidden Weapons')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spiceCost).toBe(2)
  })
})
