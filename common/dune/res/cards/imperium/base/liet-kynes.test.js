'use strict'

const card = require('./liet-kynes.js')

describe("liet-kynes", () => {
  test('data', () => {
    expect(card.id).toBe("liet-kynes")
    expect(card.name).toBe("Liet Kynes")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
