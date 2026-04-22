'use strict'

const card = require('./tleilaxu-puppet.js')

describe("tleilaxu-puppet", () => {
  test('data', () => {
    expect(card.id).toBe("tleilaxu-puppet")
    expect(card.name).toBe("Tleilaxu Puppet")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
