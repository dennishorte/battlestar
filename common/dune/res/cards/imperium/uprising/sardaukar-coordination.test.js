'use strict'

const card = require('./sardaukar-coordination.js')

describe("sardaukar-coordination", () => {
  test('data', () => {
    expect(card.id).toBe("sardaukar-coordination")
    expect(card.name).toBe("Sardaukar Coordination")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
