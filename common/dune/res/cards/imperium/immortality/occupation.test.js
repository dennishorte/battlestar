'use strict'

const card = require('./occupation.js')

describe("occupation", () => {
  test('data', () => {
    expect(card.id).toBe("occupation")
    expect(card.name).toBe("Occupation")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("All")
  })
})
