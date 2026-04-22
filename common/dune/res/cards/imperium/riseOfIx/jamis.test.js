'use strict'

const card = require('./jamis.js')

describe("jamis", () => {
  test('data', () => {
    expect(card.id).toBe("jamis")
    expect(card.name).toBe("Jamis")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
