'use strict'

const card = require('./southern-elders.js')

describe("southern-elders", () => {
  test('data', () => {
    expect(card.id).toBe("southern-elders")
    expect(card.name).toBe("Southern Elders")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
