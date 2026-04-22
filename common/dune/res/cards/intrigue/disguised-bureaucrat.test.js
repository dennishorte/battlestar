'use strict'

const card = require('./disguised-bureaucrat.js')

describe("disguised-bureaucrat", () => {
  test('data', () => {
    expect(card.id).toBe("disguised-bureaucrat")
    expect(card.name).toBe("Disguised Bureaucrat")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
