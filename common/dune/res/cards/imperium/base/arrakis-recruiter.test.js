'use strict'

const card = require('./arrakis-recruiter.js')

describe("arrakis-recruiter", () => {
  test('data', () => {
    expect(card.id).toBe("arrakis-recruiter")
    expect(card.name).toBe("Arrakis Recruiter")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
