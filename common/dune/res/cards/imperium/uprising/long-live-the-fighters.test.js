'use strict'

const card = require('./long-live-the-fighters.js')

describe("long-live-the-fighters", () => {
  test('data', () => {
    expect(card.id).toBe("long-live-the-fighters")
    expect(card.name).toBe("Long Live the Fighters")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
