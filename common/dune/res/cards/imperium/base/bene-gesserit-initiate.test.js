'use strict'

const card = require('./bene-gesserit-initiate.js')

describe("bene-gesserit-initiate", () => {
  test('data', () => {
    expect(card.id).toBe("bene-gesserit-initiate")
    expect(card.name).toBe("Bene Gesserit Initiate")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
