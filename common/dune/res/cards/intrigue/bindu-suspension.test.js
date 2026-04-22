'use strict'

const card = require('./bindu-suspension.js')

describe("bindu-suspension", () => {
  test('data', () => {
    expect(card.id).toBe("bindu-suspension")
    expect(card.name).toBe("Bindu Suspension")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
