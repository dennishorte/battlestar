'use strict'

const card = require('./inspire-awe.js')

describe("inspire-awe", () => {
  test('data', () => {
    expect(card.id).toBe("inspire-awe")
    expect(card.name).toBe("Inspire Awe")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
