'use strict'

const card = require('./sardaukar-standard.js')

describe("sardaukar-standard", () => {
  test('data', () => {
    expect(card.id).toBe("sardaukar-standard")
    expect(card.name).toBe("Sardaukar Standard")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Bloodlines")
  })
})
