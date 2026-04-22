'use strict'

const card = require('./interstellar-conspiracy.js')

describe("interstellar-conspiracy", () => {
  test('data', () => {
    expect(card.id).toBe("interstellar-conspiracy")
    expect(card.name).toBe("Interstellar Conspiracy")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
