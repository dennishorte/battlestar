'use strict'

const card = require('./sardaukar-soldier.js')

describe("sardaukar-soldier", () => {
  test('data', () => {
    expect(card.id).toBe("sardaukar-soldier")
    expect(card.name).toBe("Sardaukar Soldier")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
