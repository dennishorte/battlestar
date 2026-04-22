'use strict'

const card = require('./favored-subject.js')

describe("favored-subject", () => {
  test('data', () => {
    expect(card.id).toBe("favored-subject")
    expect(card.name).toBe("Favored Subject")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
