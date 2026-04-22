'use strict'

const card = require('./spring-the-trap.js')

describe("spring-the-trap", () => {
  test('data', () => {
    expect(card.id).toBe("spring-the-trap")
    expect(card.name).toBe("Spring the Trap")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
