'use strict'

const card = require('./tread-in-darkness.js')

describe("tread-in-darkness", () => {
  test('data', () => {
    expect(card.id).toBe("tread-in-darkness")
    expect(card.name).toBe("Tread in Darkness")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
