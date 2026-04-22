'use strict'

const card = require('./ecological-testing-station.js')

describe("ecological-testing-station", () => {
  test('data', () => {
    expect(card.id).toBe("ecological-testing-station")
    expect(card.name).toBe("Ecological Testing Station")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
