'use strict'

const card = require('./full-scale-assault.js')

describe("full-scale-assault", () => {
  test('data', () => {
    expect(card.id).toBe("full-scale-assault")
    expect(card.name).toBe("Full-Scale Assault")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("Tech (Rise of Ix)")
  })
})
