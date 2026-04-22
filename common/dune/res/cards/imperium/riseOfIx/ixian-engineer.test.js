'use strict'

const card = require('./ixian-engineer.js')

describe("ixian-engineer", () => {
  test('data', () => {
    expect(card.id).toBe("ixian-engineer")
    expect(card.name).toBe("Ixian Engineer")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("Tech (Rise of Ix)")
  })
})
