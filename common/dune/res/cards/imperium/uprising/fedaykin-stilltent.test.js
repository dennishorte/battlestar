'use strict'

const card = require('./fedaykin-stilltent.js')

describe("fedaykin-stilltent", () => {
  test('data', () => {
    expect(card.id).toBe("fedaykin-stilltent")
    expect(card.name).toBe("Fedaykin Stilltent")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
