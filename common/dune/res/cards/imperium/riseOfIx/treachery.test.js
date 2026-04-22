'use strict'

const card = require('./treachery.js')

describe("treachery", () => {
  test('data', () => {
    expect(card.id).toBe("treachery")
    expect(card.name).toBe("Treachery")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
