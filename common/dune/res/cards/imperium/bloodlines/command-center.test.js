'use strict'

const card = require('./command-center.js')

describe("command-center", () => {
  test('data', () => {
    expect(card.id).toBe("command-center")
    expect(card.name).toBe("Command Center")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
