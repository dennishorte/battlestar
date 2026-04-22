'use strict'

const card = require('./weirding-way.js')

describe("weirding-way", () => {
  test('data', () => {
    expect(card.id).toBe("weirding-way")
    expect(card.name).toBe("Weirding Way")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
