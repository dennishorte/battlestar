describe('Baking Course', () => {
  test('has correct structure and baking conversion', () => {
    const card = require('./BakingCourse.js')
    expect(card.bakingConversion).toEqual({ from: 'grain', to: 'food', rate: 2 })
    expect(card.onRoundEnd).toBeDefined()
  })

  test('calls bakeBread on non-harvest rounds only', () => {
    const card = require('./BakingCourse.js')
    const harvestRounds = [4, 7, 9, 11, 13, 14]
    const mockGame = { isHarvestRound: (round) => harvestRounds.includes(round) }
    let bakeBreadCalled = false
    mockGame.actions = { bakeBread: () => {
      bakeBreadCalled = true
    } }

    // Harvest round → should NOT call bakeBread
    card.onRoundEnd(mockGame, {}, 4)
    expect(bakeBreadCalled).toBe(false)

    // Non-harvest round → should call bakeBread
    card.onRoundEnd(mockGame, {}, 5)
    expect(bakeBreadCalled).toBe(true)
  })
})
