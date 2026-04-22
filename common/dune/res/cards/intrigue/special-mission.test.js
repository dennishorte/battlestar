'use strict'

const card = require('./special-mission.js')

describe("special-mission", () => {
  test('data', () => {
    expect(card.id).toBe("special-mission")
    expect(card.name).toBe("Special Mission")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
