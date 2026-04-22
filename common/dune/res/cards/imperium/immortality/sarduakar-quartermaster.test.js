'use strict'

const card = require('./sarduakar-quartermaster.js')

describe("sarduakar-quartermaster", () => {
  test('data', () => {
    expect(card.id).toBe("sarduakar-quartermaster")
    expect(card.name).toBe("Sarduakar Quartermaster")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
