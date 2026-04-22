'use strict'

const card = require('./bene-gesserit-operative.js')

describe("bene-gesserit-operative", () => {
  test('data', () => {
    expect(card.id).toBe("bene-gesserit-operative")
    expect(card.name).toBe("Bene Gesserit Operative")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("Uprising")
  })
})
