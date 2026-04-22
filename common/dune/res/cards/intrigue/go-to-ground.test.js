'use strict'

const card = require('./go-to-ground.js')

describe("go-to-ground", () => {
  test('data', () => {
    expect(card.id).toBe("go-to-ground")
    expect(card.name).toBe("Go to Ground")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
