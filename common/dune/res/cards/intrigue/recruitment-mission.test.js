'use strict'

const card = require('./recruitment-mission.js')

describe("recruitment-mission", () => {
  test('data', () => {
    expect(card.id).toBe("recruitment-mission")
    expect(card.name).toBe("Recruitment Mission")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
