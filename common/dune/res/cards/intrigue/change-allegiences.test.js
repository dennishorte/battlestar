'use strict'

const card = require('./change-allegiences.js')

describe("change-allegiences", () => {
  test('data', () => {
    expect(card.id).toBe("change-allegiences")
    expect(card.name).toBe("Change Allegiences")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
