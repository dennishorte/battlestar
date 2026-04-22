'use strict'

const card = require('./captured-mentat.js')

describe("captured-mentat", () => {
  test('data', () => {
    expect(card.id).toBe("captured-mentat")
    expect(card.name).toBe("Captured Mentat")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
