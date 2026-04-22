'use strict'

const card = require('./dissecting-kit.js')

describe("dissecting-kit", () => {
  test('data', () => {
    expect(card.id).toBe("dissecting-kit")
    expect(card.name).toBe("Dissecting Kit")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
