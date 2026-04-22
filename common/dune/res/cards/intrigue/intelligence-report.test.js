'use strict'

const card = require('./intelligence-report.js')

describe("intelligence-report", () => {
  test('data', () => {
    expect(card.id).toBe("intelligence-report")
    expect(card.name).toBe("Intelligence Report")
    expect(card.source).toBe("Uprising")
    expect(card.compatibility).toBe("All")
  })
})
