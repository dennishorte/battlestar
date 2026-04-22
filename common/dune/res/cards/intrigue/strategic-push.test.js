'use strict'

const card = require('./strategic-push.js')

describe("strategic-push", () => {
  test('data', () => {
    expect(card.id).toBe("strategic-push")
    expect(card.name).toBe("Strategic Push")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
