'use strict'

const card = require('./for-humanity.js')

describe("for-humanity", () => {
  test('data', () => {
    expect(card.id).toBe("for-humanity")
    expect(card.name).toBe("For Humanity")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
