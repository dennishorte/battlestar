'use strict'

const card = require('./truthsayer.js')

describe("truthsayer", () => {
  test('data', () => {
    expect(card.id).toBe("truthsayer")
    expect(card.name).toBe("Truthsayer")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
