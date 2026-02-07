const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Family Friendly Home (A021)', () => {
  test('gives food and family growth when rooms > people', () => {
    const card = res.getCardById('family-friendly-home-a021')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getRoomCount = () => 3
    dennis.familyMembers = 2

    let familyGrowthCalled = false
    game.actions.familyGrowth = (player, opts) => {
      familyGrowthCalled = true
      expect(opts.fromCard).toBe(true)
    }

    card.onBuildRoom(game, dennis)

    expect(dennis.food).toBe(1)
    expect(familyGrowthCalled).toBe(true)
  })

  test('does not trigger when rooms <= people', () => {
    const card = res.getCardById('family-friendly-home-a021')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0
    dennis.getRoomCount = () => 2
    dennis.familyMembers = 2

    let familyGrowthCalled = false
    game.actions.familyGrowth = () => {
      familyGrowthCalled = true
    }

    card.onBuildRoom(game, dennis)

    expect(dennis.food).toBe(0)
    expect(familyGrowthCalled).toBe(false)
  })
})
