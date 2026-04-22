'use strict'

const card = require('./duncan-idaho.js')

describe("duncan-idaho", () => {
  test('data', () => {
    expect(card.id).toBe("duncan-idaho")
    expect(card.name).toBe("Duncan Idaho")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
