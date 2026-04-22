'use strict'

const card = require('./dispatch-an-envoy.js')

describe("dispatch-an-envoy", () => {
  test('data', () => {
    expect(card.id).toBe("dispatch-an-envoy")
    expect(card.name).toBe("Dispatch an Envoy")
    expect(card.source).toBe("Base")
    expect(card.compatibility).toBe("All")
  })
})
