describe('Farm Hand', () => {
  // Card text: "Once you have 4 field tiles arranged in a 2x2, you can
  // use a 'Build Stables' action to build a stable in the center of the
  // 2x2. This stable provides room for a person but no animal."
  // Uses allowsCenterStable passive. Card is 1+ players.

  test('card defines allowsCenterStable flag', () => {
    const card = require('../occupationB/FarmHand.js')
    expect(card.allowsCenterStable).toBe(true)
    expect(typeof card.getCenterStableLocation).toBe('function')
  })
})
