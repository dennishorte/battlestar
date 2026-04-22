'use strict'

const card = require('./tleilaxu-master.js')

describe("tleilaxu-master", () => {
  test('data', () => {
    expect(card.id).toBe("tleilaxu-master")
    expect(card.name).toBe("Tleilaxu Master")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
