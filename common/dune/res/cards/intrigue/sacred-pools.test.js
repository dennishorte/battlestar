'use strict'

const card = require('./sacred-pools.js')

describe("sacred-pools", () => {
  test('data', () => {
    expect(card.id).toBe("sacred-pools")
    expect(card.name).toBe("Sacred Pools")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
