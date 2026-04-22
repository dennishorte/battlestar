'use strict'

const card = require('./power-play.js')

describe("power-play", () => {
  test('data', () => {
    expect(card.id).toBe("power-play")
    expect(card.name).toBe("Power Play")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
