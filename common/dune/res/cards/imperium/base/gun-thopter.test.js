'use strict'

const card = require('./gun-thopter.js')

describe("gun-thopter", () => {
  test('data', () => {
    expect(card.id).toBe("gun-thopter")
    expect(card.name).toBe("Gun Thopter")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
