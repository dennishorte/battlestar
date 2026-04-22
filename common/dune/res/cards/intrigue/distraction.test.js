'use strict'

const card = require('./distraction.js')

describe("distraction", () => {
  test('data', () => {
    expect(card.id).toBe("distraction")
    expect(card.name).toBe("Distraction")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
