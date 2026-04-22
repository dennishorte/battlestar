'use strict'

const card = require('./tleilaxu-surgeon.js')

describe("tleilaxu-surgeon", () => {
  test('data', () => {
    expect(card.id).toBe("tleilaxu-surgeon")
    expect(card.name).toBe("Tleilaxu Surgeon")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
