'use strict'

const card = require('./cargo-runner.js')

describe("cargo-runner", () => {
  test('data', () => {
    expect(card.id).toBe("cargo-runner")
    expect(card.name).toBe("Cargo Runner")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
