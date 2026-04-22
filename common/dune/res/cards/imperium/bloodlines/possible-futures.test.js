'use strict'

const card = require('./possible-futures.js')

describe("possible-futures", () => {
  test('data', () => {
    expect(card.id).toBe("possible-futures")
    expect(card.name).toBe("Possible Futures")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
