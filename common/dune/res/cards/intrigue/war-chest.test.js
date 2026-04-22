'use strict'

const card = require('./war-chest.js')

describe("war-chest", () => {
  test('data', () => {
    expect(card.id).toBe("war-chest")
    expect(card.name).toBe("War Chest")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
