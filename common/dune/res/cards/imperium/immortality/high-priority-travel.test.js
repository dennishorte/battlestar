'use strict'

const card = require('./high-priority-travel.js')

describe("high-priority-travel", () => {
  test('data', () => {
    expect(card.id).toBe("high-priority-travel")
    expect(card.name).toBe("High Priority Travel")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
