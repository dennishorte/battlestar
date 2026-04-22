'use strict'

const card = require('./crysknife.js')

describe("crysknife", () => {
  test('data', () => {
    expect(card.id).toBe("crysknife")
    expect(card.name).toBe("Crysknife")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
