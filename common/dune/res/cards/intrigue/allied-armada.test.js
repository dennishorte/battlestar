'use strict'

const card = require('./allied-armada.js')

describe("allied-armada", () => {
  test('data', () => {
    expect(card.id).toBe("allied-armada")
    expect(card.name).toBe("Allied Armada")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
