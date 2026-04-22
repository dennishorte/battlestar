'use strict'

const card = require('./worm-riders.js')

describe("worm-riders", () => {
  test('data', () => {
    expect(card.id).toBe("worm-riders")
    expect(card.name).toBe("Worm Riders")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
