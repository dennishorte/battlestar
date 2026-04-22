'use strict'

const card = require('./keys-to-power.js')

describe("keys-to-power", () => {
  test('data', () => {
    expect(card.id).toBe("keys-to-power")
    expect(card.name).toBe("Keys to Power")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
