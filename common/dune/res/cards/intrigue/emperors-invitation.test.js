'use strict'

const card = require('./emperors-invitation.js')

describe("emperors-invitation", () => {
  test('data', () => {
    expect(card.id).toBe("emperors-invitation")
    expect(card.name).toBe("Emperor's Invitation")
    expect(card.source).toBe("Bloodlines")
    expect(card.compatibility).toBe("All")
  })
})
