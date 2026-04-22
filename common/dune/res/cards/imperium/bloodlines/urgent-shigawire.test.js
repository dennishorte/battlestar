'use strict'

const card = require('./urgent-shigawire.js')

describe("urgent-shigawire", () => {
  test('data', () => {
    expect(card.id).toBe("urgent-shigawire")
    expect(card.name).toBe("Urgent Shigawire")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
