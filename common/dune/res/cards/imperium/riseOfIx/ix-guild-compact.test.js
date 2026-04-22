'use strict'

const card = require('./ix-guild-compact.js')

describe("ix-guild-compact", () => {
  test('data', () => {
    expect(card.id).toBe("ix-guild-compact")
    expect(card.name).toBe("Ix-Guild Compact")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("Tech (Rise of Ix)")
  })
})
