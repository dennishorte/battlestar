'use strict'

const card = require('./choam-transports.js')

describe('CHOAM Transports', () => {
  test('card data', () => {
    expect(card.id).toBe('choam-transports')
    expect(card.name).toBe('CHOAM Transports')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spiceCost).toBe(6)
  })
})
