'use strict'

const card = require('./gruesome-sacrifice.js')

describe("gruesome-sacrifice", () => {
  test('data', () => {
    expect(card.id).toBe("gruesome-sacrifice")
    expect(card.name).toBe("Gruesome Sacrifice")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
