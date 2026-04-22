'use strict'

const card = require('./double-agent.js')

describe("double-agent", () => {
  test('data', () => {
    expect(card.id).toBe("double-agent")
    expect(card.name).toBe("Double Agent")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
