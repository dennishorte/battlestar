'use strict'

const card = require('./advanced-data-analysis.js')

describe('Advanced Data Analysis', () => {
  test('card data', () => {
    expect(card.id).toBe('advanced-data-analysis')
    expect(card.name).toBe('Advanced Data Analysis')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Uprising')
    expect(card.spiceCost).toBe(3)
  })
})
