'use strict'

const card = require('./second-wave.js')

describe("second-wave", () => {
  test('data', () => {
    expect(card.id).toBe("second-wave")
    expect(card.name).toBe("Second Wave")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
