'use strict'

const card = require('./shifting-allegiances.js')

describe("shifting-allegiances", () => {
  test('data', () => {
    expect(card.id).toBe("shifting-allegiances")
    expect(card.name).toBe("Shifting Allegiances")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
