'use strict'

const card = require('./double-cross.js')

describe("double-cross", () => {
  test('data', () => {
    expect(card.id).toBe("double-cross")
    expect(card.name).toBe("Double Cross")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
