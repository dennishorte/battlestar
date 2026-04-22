'use strict'

const card = require('./cull.js')

describe("cull", () => {
  test('data', () => {
    expect(card.id).toBe("cull")
    expect(card.name).toBe("Cull")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
