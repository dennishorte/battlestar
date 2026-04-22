'use strict'

const card = require('./organ-merchants.js')

describe("organ-merchants", () => {
  test('data', () => {
    expect(card.id).toBe("organ-merchants")
    expect(card.name).toBe("Organ Merchants")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
