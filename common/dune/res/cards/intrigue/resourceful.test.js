'use strict'

const card = require('./resourceful.js')

describe("resourceful", () => {
  test('data', () => {
    expect(card.id).toBe("resourceful")
    expect(card.name).toBe("Resourceful")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
