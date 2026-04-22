'use strict'

const card = require('./illicit-dealings.js')

describe("illicit-dealings", () => {
  test('data', () => {
    expect(card.id).toBe("illicit-dealings")
    expect(card.name).toBe("Illicit Dealings")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
