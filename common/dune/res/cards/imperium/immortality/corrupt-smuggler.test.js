'use strict'

const card = require('./corrupt-smuggler.js')

describe("corrupt-smuggler", () => {
  test('data', () => {
    expect(card.id).toBe("corrupt-smuggler")
    expect(card.name).toBe("Corrupt Smuggler")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
