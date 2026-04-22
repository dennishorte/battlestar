'use strict'

const card = require('./fremen-camp.js')

describe("fremen-camp", () => {
  test('data', () => {
    expect(card.id).toBe("fremen-camp")
    expect(card.name).toBe("Fremen Camp")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
