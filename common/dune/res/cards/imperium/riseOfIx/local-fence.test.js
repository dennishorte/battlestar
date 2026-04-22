'use strict'

const card = require('./local-fence.js')

describe("local-fence", () => {
  test('data', () => {
    expect(card.id).toBe("local-fence")
    expect(card.name).toBe("Local Fence")
    expect(card.source).toBe("Rise of Ix")
    expect(card.compatibility).toBe("All")
  })
})
