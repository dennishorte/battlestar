'use strict'

const card = require('./ixian-probe.js')

describe("ixian-probe", () => {
  test('data', () => {
    expect(card.id).toBe("ixian-probe")
    expect(card.name).toBe("Ixian Probe")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
