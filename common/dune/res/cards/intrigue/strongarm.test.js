'use strict'

const card = require('./strongarm.js')

describe("strongarm", () => {
  test('data', () => {
    expect(card.id).toBe("strongarm")
    expect(card.name).toBe("Strongarm")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
