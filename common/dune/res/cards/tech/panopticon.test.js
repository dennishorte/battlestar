'use strict'

const card = require('./panopticon.js')

describe('Panopticon', () => {
  test('card data', () => {
    expect(card.id).toBe('panopticon')
    expect(card.name).toBe('Panopticon')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spiceCost).toBe(5)
  })
})
