'use strict'

const card = require('./cannon-turrets.js')

describe("cannon-turrets", () => {
  test('data', () => {
    expect(card.id).toBe("cannon-turrets")
    expect(card.name).toBe("Cannon Turrets")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
