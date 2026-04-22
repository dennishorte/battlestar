'use strict'

const card = require('./breakthrough.js')

describe("breakthrough", () => {
  test('data', () => {
    expect(card.id).toBe("breakthrough")
    expect(card.name).toBe("Breakthrough")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
