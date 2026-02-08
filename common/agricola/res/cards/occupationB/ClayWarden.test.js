const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Clay Warden (B143)', () => {
  test('gives 2 clay in 3-player game when another player uses Hollow', () => {
    const card = res.getCardById('clay-warden-b143')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.clay = 0
    game.players.count = jest.fn().mockReturnValue(3)

    card.onAnyAction(game, micah, 'take-clay-2', dennis)

    expect(dennis.clay).toBe(2)
  })

  test('gives 1 clay and 1 food in 4-player game when another player uses Hollow', () => {
    const card = res.getCardById('clay-warden-b143')
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.clay = 0
    dennis.food = 0
    game.players.count = jest.fn().mockReturnValue(4)

    card.onAnyAction(game, micah, 'take-clay-2', dennis)

    expect(dennis.clay).toBe(1)
    expect(dennis.food).toBe(1)
  })

  test('gives 1 clay in 5+ player game when another player uses Hollow', () => {
    const card = res.getCardById('clay-warden-b143')
    const game = t.fixture({ numPlayers: 5, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.clay = 0
    game.players.count = jest.fn().mockReturnValue(5)

    card.onAnyAction(game, micah, 'take-clay-2', dennis)

    expect(dennis.clay).toBe(1)
  })

  test('does not trigger when card owner uses Hollow', () => {
    const card = res.getCardById('clay-warden-b143')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAnyAction(game, dennis, 'take-clay-2', dennis)

    expect(dennis.clay).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('clay-warden-b143')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    const micah = t.player(game, 'micah')
    dennis.clay = 0

    card.onAnyAction(game, micah, 'take-wood', dennis)

    expect(dennis.clay).toBe(0)
  })
})
