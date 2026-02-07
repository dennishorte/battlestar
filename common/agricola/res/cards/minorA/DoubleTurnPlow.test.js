const t = require('../../../testutil.js')
const res = require('../../index.js')

describe('Double-Turn Plow (A020)', () => {
  test('plows up to 2 fields on play', () => {
    const card = res.getCardById('double-turn-plow-a020')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)

    let plowCount = 0
    game.actions.plowField = (player, opts) => {
      plowCount++
      expect(opts.immediate).toBe(true)
      expect(opts.optional).toBe(true)
    }

    card.onPlay(game, dennis)

    expect(plowCount).toBe(2)
  })

  test('has normal cost before round 4', () => {
    const card = res.getCardById('double-turn-plow-a020')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 3

    const cost = card.getSpecialCost(dennis, game)

    expect(cost).toEqual({ grain: 1 })
  })

  test('has additional food cost from round 4', () => {
    const card = res.getCardById('double-turn-plow-a020')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 4

    const cost = card.getSpecialCost(dennis, game)

    expect(cost).toEqual({ grain: 1, food: 1 })
  })

  test('has additional food cost in later rounds', () => {
    const card = res.getCardById('double-turn-plow-a020')
    const game = t.fixture({ cardSets: ['minorA'] })
    game.run()

    const dennis = t.player(game)
    game.state.round = 10

    const cost = card.getSpecialCost(dennis, game)

    expect(cost).toEqual({ grain: 1, food: 1 })
  })
})
