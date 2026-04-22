'use strict'

const card = require('./sardaukar-infantry.js')

describe("sardaukar-infantry", () => {
  test('data', () => {
    expect(card.id).toBe("sardaukar-infantry")
    expect(card.name).toBe("Sardaukar Infantry")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
