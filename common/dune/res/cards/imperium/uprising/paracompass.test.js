'use strict'

const card = require('./paracompass.js')

describe("paracompass", () => {
  test('data', () => {
    expect(card.id).toBe("paracompass")
    expect(card.name).toBe("Paracompass")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
