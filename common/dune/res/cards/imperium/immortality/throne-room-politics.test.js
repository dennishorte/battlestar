'use strict'

const card = require('./throne-room-politics.js')

describe("throne-room-politics", () => {
  test('data', () => {
    expect(card.id).toBe("throne-room-politics")
    expect(card.name).toBe("Throne Room Politics")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
