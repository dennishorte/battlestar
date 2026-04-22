'use strict'

const card = require('./self-destroying-messages.js')

describe('Self-Destroying Messages', () => {
  test('card data', () => {
    expect(card.id).toBe('self-destroying-messages')
    expect(card.name).toBe('Self-Destroying Messages')
    expect(card.source).toBe('Bloodlines')
    expect(card.compatibility).toBe('Rise of Ix')
    expect(card.spiceCost).toBe(4)
  })
})
