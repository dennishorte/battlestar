const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Fishing Net (C051)', () => {
  test('has onAnyAction hook', () => {
    const card = res.getCardById('fishing-net-c051')
    expect(card.onAnyAction).toBeDefined()
  })

  test('transfers food when another player uses fishing', () => {
    const card = res.getCardById('fishing-net-c051')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 3

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(dennis.food).toBe(1)
    expect(micah.food).toBe(2)
    expect(game.state.fishingNetBonus).toBe(2)
  })

  test('does not transfer food when owner uses fishing', () => {
    const card = res.getCardById('fishing-net-c051')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    dennis.food = 3

    card.onAnyAction(game, dennis, 'fishing', dennis)

    expect(dennis.food).toBe(3)
    expect(game.state.fishingNetBonus).toBeUndefined()
  })

  test('does not trigger on non-fishing actions', () => {
    const card = res.getCardById('fishing-net-c051')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 3

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.food).toBe(0)
    expect(micah.food).toBe(3)
  })

  test('does not trigger when acting player has no food', () => {
    const card = res.getCardById('fishing-net-c051')
    const game = t.fixture({ cardSets: ['minorC'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.food = 0
    micah.food = 0

    card.onAnyAction(game, micah, 'fishing', dennis)

    expect(dennis.food).toBe(0)
    expect(micah.food).toBe(0)
  })
})
