'use strict'

const card = require('./assassination-mission.js')

describe("assassination-mission", () => {
  test('data', () => {
    expect(card.id).toBe("assassination-mission")
    expect(card.name).toBe("Assassination Mission")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
