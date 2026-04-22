'use strict'

const card = require('./reach-agreement.js')

describe("reach-agreement", () => {
  test('data', () => {
    expect(card.id).toBe("reach-agreement")
    expect(card.name).toBe("Reach Agreement")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
