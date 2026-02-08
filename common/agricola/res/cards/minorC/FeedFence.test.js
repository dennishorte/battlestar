const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Feed Fence (C056)', () => {
  test('has allowsClayStable flag', () => {
    const card = res.getCardById('feed-fence-c056')
    expect(card.allowsClayStable).toBe(true)
  })

  test('has onBuildStable hook', () => {
    const card = res.getCardById('feed-fence-c056')
    expect(card.onBuildStable).toBeDefined()
  })

  test('gives 1 food for non-last stable', () => {
    const card = res.getCardById('feed-fence-c056')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onBuildStable(game, dennis, false)

    expect(dennis.food).toBe(1)
  })

  test('gives 3 food for last stable', () => {
    const card = res.getCardById('feed-fence-c056')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 0

    card.onBuildStable(game, dennis, true)

    expect(dennis.food).toBe(3)
  })

  test('costs 1 wood', () => {
    const card = res.getCardById('feed-fence-c056')
    expect(card.cost.wood).toBe(1)
  })
})
