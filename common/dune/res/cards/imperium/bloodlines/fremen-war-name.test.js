'use strict'

const card = require('./fremen-war-name.js')

describe("fremen-war-name", () => {
  test('data', () => {
    expect(card.id).toBe("fremen-war-name")
    expect(card.name).toBe("Fremen War Name")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
