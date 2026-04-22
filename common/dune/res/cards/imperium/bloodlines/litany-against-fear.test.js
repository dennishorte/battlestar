'use strict'

const card = require('./litany-against-fear.js')

describe("litany-against-fear", () => {
  test('data', () => {
    expect(card.id).toBe("litany-against-fear")
    expect(card.name).toBe("Litany Against Fear")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
