'use strict'

const card = require('./fedaykin-death-commando.js')

describe("fedaykin-death-commando", () => {
  test('data', () => {
    expect(card.id).toBe("fedaykin-death-commando")
    expect(card.name).toBe("Fedaykin Death Commando")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
