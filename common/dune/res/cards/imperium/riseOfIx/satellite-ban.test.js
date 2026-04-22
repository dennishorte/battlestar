'use strict'

const card = require('./satellite-ban.js')

describe("satellite-ban", () => {
  test('data', () => {
    expect(card.id).toBe("satellite-ban")
    expect(card.name).toBe("Satellite Ban")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
