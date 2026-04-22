'use strict'

const card = require('./holoprojectors.js')

describe('Holoprojectors', () => {
  test('card data', () => {
    expect(card.id).toBe('holoprojectors')
    expect(card.name).toBe('Holoprojectors')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(3)
  })
})
