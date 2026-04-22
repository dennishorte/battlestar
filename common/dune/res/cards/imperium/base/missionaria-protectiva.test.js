'use strict'

const card = require('./missionaria-protectiva.js')

describe("missionaria-protectiva", () => {
  test('data', () => {
    expect(card.id).toBe("missionaria-protectiva")
    expect(card.name).toBe("Missionaria Protectiva")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
