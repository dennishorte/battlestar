'use strict'

const card = require('./bounty-hunter.js')

describe("bounty-hunter", () => {
  test('data', () => {
    expect(card.id).toBe("bounty-hunter")
    expect(card.name).toBe("Bounty Hunter")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
