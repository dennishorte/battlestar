'use strict'

const card = require('./desert-ambush.js')

describe("desert-ambush", () => {
  test('data', () => {
    expect(card.id).toBe("desert-ambush")
    expect(card.name).toBe("Desert Ambush")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
