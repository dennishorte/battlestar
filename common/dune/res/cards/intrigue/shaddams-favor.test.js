'use strict'

const card = require('./shaddams-favor.js')

describe("shaddams-favor", () => {
  test('data', () => {
    expect(card.id).toBe("shaddams-favor")
    expect(card.name).toBe("Shaddam's Favor")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
