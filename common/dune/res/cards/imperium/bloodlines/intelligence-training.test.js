'use strict'

const card = require('./intelligence-training.js')

describe("intelligence-training", () => {
  test('data', () => {
    expect(card.id).toBe("intelligence-training")
    expect(card.name).toBe("Intelligence Training")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
