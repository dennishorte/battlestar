'use strict'

const card = require('./urgent-mission.js')

describe("urgent-mission", () => {
  test('data', () => {
    expect(card.id).toBe("urgent-mission")
    expect(card.name).toBe("Urgent Mission")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
