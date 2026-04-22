'use strict'

const card = require('./grasp-arrakis.js')

describe("grasp-arrakis", () => {
  test('data', () => {
    expect(card.id).toBe("grasp-arrakis")
    expect(card.name).toBe("Grasp Arrakis")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
