'use strict'

const card = require('./reliable-informant.js')

describe("reliable-informant", () => {
  test('data', () => {
    expect(card.id).toBe("reliable-informant")
    expect(card.name).toBe("Reliable Informant")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
