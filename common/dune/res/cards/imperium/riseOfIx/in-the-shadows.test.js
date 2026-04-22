'use strict'

const card = require('./in-the-shadows.js')

describe("in-the-shadows", () => {
  test('data', () => {
    expect(card.id).toBe("in-the-shadows")
    expect(card.name).toBe("In the Shadows")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
