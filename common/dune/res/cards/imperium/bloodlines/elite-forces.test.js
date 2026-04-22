'use strict'

const card = require('./elite-forces.js')

describe("elite-forces", () => {
  test('data', () => {
    expect(card.id).toBe("elite-forces")
    expect(card.name).toBe("Elite Forces")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
