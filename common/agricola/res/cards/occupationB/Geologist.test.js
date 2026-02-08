const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Geologist (B121)', () => {
  test('gives 1 clay when using Forest action', () => {
    const card = res.getCardById('geologist-b121')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'take-wood')

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when using Reed Bank action', () => {
    const card = res.getCardById('geologist-b121')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'take-reed')

    expect(dennis.clay).toBe(1)
  })

  test('gives 1 clay when using Clay Pit in 3+ player game', () => {
    const card = res.getCardById('geologist-b121')
    const game = t.fixture({ numPlayers: 3, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    game.players.count = jest.fn().mockReturnValue(3)

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.clay).toBe(1)
  })

  test('does not give clay when using Clay Pit in 2 player game', () => {
    const card = res.getCardById('geologist-b121')
    const game = t.fixture({ numPlayers: 2, cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0
    game.players.count = jest.fn().mockReturnValue(2)

    card.onAction(game, dennis, 'take-clay')

    expect(dennis.clay).toBe(0)
  })

  test('does not trigger for other actions', () => {
    const card = res.getCardById('geologist-b121')
    const game = t.fixture({ cardSets: ['occupationB'] })
    game.run()

    const dennis = t.player(game)
    dennis.clay = 0

    card.onAction(game, dennis, 'day-laborer')

    expect(dennis.clay).toBe(0)
  })
})
