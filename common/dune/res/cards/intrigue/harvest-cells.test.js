'use strict'

const card = require('./harvest-cells.js')

describe("harvest-cells", () => {
  test('data', () => {
    expect(card.id).toBe("harvest-cells")
    expect(card.name).toBe("Harvest Cells")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
