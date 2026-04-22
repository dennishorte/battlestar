'use strict'

const card = require('./staged-incident.js')

describe("staged-incident", () => {
  test('data', () => {
    expect(card.id).toBe("staged-incident")
    expect(card.name).toBe("Staged Incident")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
