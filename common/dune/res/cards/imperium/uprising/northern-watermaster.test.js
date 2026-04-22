'use strict'

const card = require('./northern-watermaster.js')

describe("northern-watermaster", () => {
  test('data', () => {
    expect(card.id).toBe("northern-watermaster")
    expect(card.name).toBe("Northern Watermaster")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
