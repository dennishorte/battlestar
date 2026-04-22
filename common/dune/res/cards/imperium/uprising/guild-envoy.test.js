'use strict'

const card = require('./guild-envoy.js')

describe("guild-envoy", () => {
  test('data', () => {
    expect(card.id).toBe("guild-envoy")
    expect(card.name).toBe("Guild Envoy")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
