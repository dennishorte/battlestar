'use strict'

const card = require('./restricted-ordinance.js')

describe('Restricted Ordinance', () => {
  test('card data', () => {
    expect(card.id).toBe('restricted-ordinance')
    expect(card.name).toBe('Restricted Ordinance')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(4)
  })
})
