'use strict'

const card = require('./web-of-power.js')

describe("web-of-power", () => {
  test('data', () => {
    expect(card.id).toBe("web-of-power")
    expect(card.name).toBe("Web of Power")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
