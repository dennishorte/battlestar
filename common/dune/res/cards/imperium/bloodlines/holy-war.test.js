'use strict'

const card = require('./holy-war.js')

describe("holy-war", () => {
  test('data', () => {
    expect(card.id).toBe("holy-war")
    expect(card.name).toBe("Holy War")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
