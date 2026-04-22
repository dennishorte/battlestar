'use strict'

const card = require('./spice-smugglers.js')

describe("spice-smugglers", () => {
  test('data', () => {
    expect(card.id).toBe("spice-smugglers")
    expect(card.name).toBe("Spice Smugglers")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
