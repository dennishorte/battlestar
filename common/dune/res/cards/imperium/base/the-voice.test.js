'use strict'

const card = require('./the-voice.js')

describe("the-voice", () => {
  test('data', () => {
    expect(card.id).toBe("the-voice")
    expect(card.name).toBe("The Voice")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
