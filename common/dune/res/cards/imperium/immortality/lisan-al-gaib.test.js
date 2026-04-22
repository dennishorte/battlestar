'use strict'

const card = require('./lisan-al-gaib.js')

describe("lisan-al-gaib", () => {
  test('data', () => {
    expect(card.id).toBe("lisan-al-gaib")
    expect(card.name).toBe("Lisan Al Gaib")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
