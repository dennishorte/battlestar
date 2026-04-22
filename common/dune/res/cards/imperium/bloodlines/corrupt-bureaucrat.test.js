'use strict'

const card = require('./corrupt-bureaucrat.js')

describe("corrupt-bureaucrat", () => {
  test('data', () => {
    expect(card.id).toBe("corrupt-bureaucrat")
    expect(card.name).toBe("Corrupt Bureaucrat")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("Uprising")
  })
})
