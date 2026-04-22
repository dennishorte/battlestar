'use strict'

const card = require('./machine-culture.js')

describe("machine-culture", () => {
  test('data', () => {
    expect(card.id).toBe("machine-culture")
    expect(card.name).toBe("Machine Culture")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
