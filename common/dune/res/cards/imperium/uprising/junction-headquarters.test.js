'use strict'

const card = require('./junction-headquarters.js')

describe("junction-headquarters", () => {
  test('data', () => {
    expect(card.id).toBe("junction-headquarters")
    expect(card.name).toBe("Junction Headquarters")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
