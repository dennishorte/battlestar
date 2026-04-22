'use strict'

const card = require('./choam-delegate.js')

describe("choam-delegate", () => {
  test('data', () => {
    expect(card.id).toBe("choam-delegate")
    expect(card.name).toBe("CHOAM Delegate")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
