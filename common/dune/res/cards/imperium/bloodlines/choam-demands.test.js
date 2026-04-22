'use strict'

const card = require('./choam-demands.js')

describe("choam-demands", () => {
  test('data', () => {
    expect(card.id).toBe("choam-demands")
    expect(card.name).toBe("CHOAM Demands")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
