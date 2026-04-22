'use strict'

const card = require('./sandwalk.js')

describe("sandwalk", () => {
  test('data', () => {
    expect(card.id).toBe("sandwalk")
    expect(card.name).toBe("Sandwalk")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
