'use strict'

const card = require('./disposal-facility.js')

describe('Disposal Facility', () => {
  test('card data', () => {
    expect(card.id).toBe('disposal-facility')
    expect(card.name).toBe('Disposal Facility')
    expect(card.source).toBe('Rise of Ix')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(3)
  })
})
