'use strict'

const card = require('./embedded-agent.js')

describe("embedded-agent", () => {
  test('data', () => {
    expect(card.id).toBe("embedded-agent")
    expect(card.name).toBe("Embedded Agent")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("Shipping (Rise of Ix)")
  })
})
