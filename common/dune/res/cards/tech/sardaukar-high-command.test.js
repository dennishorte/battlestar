'use strict'

const card = require('./sardaukar-high-command.js')

describe('Sardaukar High Command', () => {
  test('card data', () => {
    expect(card.id).toBe('sardaukar-high-command')
    expect(card.name).toBe('Sardaukar High Command')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Bloodlines')
    expect(card.spiceCost).toBe(7)
  })
})
