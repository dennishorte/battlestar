'use strict'

const card = require('./study-melange.js')

describe("study-melange", () => {
  test('data', () => {
    expect(card.id).toBe("study-melange")
    expect(card.name).toBe("Study Melange")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
