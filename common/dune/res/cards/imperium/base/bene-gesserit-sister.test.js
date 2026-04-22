'use strict'

const card = require('./bene-gesserit-sister.js')

describe("bene-gesserit-sister", () => {
  test('data', () => {
    expect(card.id).toBe("bene-gesserit-sister")
    expect(card.name).toBe("Bene Gesserit Sister")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
