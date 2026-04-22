'use strict'

const card = require('./planned-coupling.js')

describe("planned-coupling", () => {
  test('data', () => {
    expect(card.id).toBe("planned-coupling")
    expect(card.name).toBe("Planned Coupling")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
