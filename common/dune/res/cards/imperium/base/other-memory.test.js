'use strict'

const card = require('./other-memory.js')

describe("other-memory", () => {
  test('data', () => {
    expect(card.id).toBe("other-memory")
    expect(card.name).toBe("Other Memory")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
