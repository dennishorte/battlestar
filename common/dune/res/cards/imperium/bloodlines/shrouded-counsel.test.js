'use strict'

const card = require('./shrouded-counsel.js')

describe("shrouded-counsel", () => {
  test('data', () => {
    expect(card.id).toBe("shrouded-counsel")
    expect(card.name).toBe("Shrouded Counsel")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
