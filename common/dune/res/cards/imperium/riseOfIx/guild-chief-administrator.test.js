'use strict'

const card = require('./guild-chief-administrator.js')

describe("guild-chief-administrator", () => {
  test('data', () => {
    expect(card.id).toBe("guild-chief-administrator")
    expect(card.name).toBe("Guild Chief Administrator")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("Shipping (Rise of Ix)")
  })
})
