'use strict'

const card = require('./test-of-humanity.js')

describe("test-of-humanity", () => {
  test('data', () => {
    expect(card.id).toBe("test-of-humanity")
    expect(card.name).toBe("Test of Humanity")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
