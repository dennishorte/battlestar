'use strict'

const card = require('./southern-faith.js')

describe("southern-faith", () => {
  test('data', () => {
    expect(card.id).toBe("southern-faith")
    expect(card.name).toBe("Southern Faith")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
