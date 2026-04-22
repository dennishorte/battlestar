'use strict'

const card = require('./the-sleeper-must-awaken.js')

describe("the-sleeper-must-awaken", () => {
  test('data', () => {
    expect(card.id).toBe("the-sleeper-must-awaken")
    expect(card.name).toBe("The Sleeper Must Awaken")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
