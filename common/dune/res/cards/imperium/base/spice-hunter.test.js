'use strict'

const card = require('./spice-hunter.js')

describe("spice-hunter", () => {
  test('data', () => {
    expect(card.id).toBe("spice-hunter")
    expect(card.name).toBe("Spice Hunter")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
