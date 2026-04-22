'use strict'

const card = require('./return-the-favor.js')

describe("return-the-favor", () => {
  test('data', () => {
    expect(card.id).toBe("return-the-favor")
    expect(card.name).toBe("Return the Favor")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
