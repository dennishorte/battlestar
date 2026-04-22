'use strict'

const card = require('./shai-hulud.js')

describe("shai-hulud", () => {
  test('data', () => {
    expect(card.id).toBe("shai-hulud")
    expect(card.name).toBe("Shai-Hulud")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
