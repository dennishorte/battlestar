'use strict'

const card = require('./rapid-dropships.js')

describe('Rapid Dropships', () => {
  test('card data', () => {
    expect(card.id).toBe('rapid-dropships')
    expect(card.name).toBe('Rapid Dropships')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(4)
  })
})
