'use strict'

const card = require('./blank-slate.js')

describe("blank-slate", () => {
  test('data', () => {
    expect(card.id).toBe("blank-slate")
    expect(card.name).toBe("Blank Slate")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
