'use strict'

const card = require('./clandestine-meeting.js')

describe("clandestine-meeting", () => {
  test('data', () => {
    expect(card.id).toBe("clandestine-meeting")
    expect(card.name).toBe("Clandestine Meeting")
    expect(card.source).toBe("Immortality")
    expect(card.compatibility).toBe("Immortality")
  })
})
