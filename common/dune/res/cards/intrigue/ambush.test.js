'use strict'

const card = require('./ambush.js')

describe("ambush", () => {
  test('data', () => {
    expect(card.id).toBe("ambush")
    expect(card.name).toBe("Ambush")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
