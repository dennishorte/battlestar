'use strict'

const card = require('./treacherous-maneuver.js')

describe("treacherous-maneuver", () => {
  test('data', () => {
    expect(card.id).toBe("treacherous-maneuver")
    expect(card.name).toBe("Treacherous Maneuver")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
