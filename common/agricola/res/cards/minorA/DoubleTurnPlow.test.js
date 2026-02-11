const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Double-Turn Plow', () => {
  test('plows up to 2 fields on play via Meeting Place', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['double-turn-plow-a020'],
        grain: 1, // cost of Double-Turn Plow
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Double-Turn Plow')
    // onPlay triggers 2 plowField actions (optional)
    t.choose(game, '0,2') // plow field 1
    t.choose(game, '0,3') // plow field 2

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        hand: [],
        minorImprovements: ['double-turn-plow-a020'],
        farmyard: {
          fields: [{ row: 0, col: 2 }, { row: 0, col: 3 }],
        },
      },
    })
  })

  test('has normal cost before round 4', () => {
    const card = res.getCardById('double-turn-plow-a020')
    const game = t.fixture()
    t.setBoard(game, { round: 4 })
    game.run()

    game.state.round = 3
    const cost = card.getSpecialCost(null, game)
    expect(cost).toEqual({ grain: 1 })
  })

  test('has additional food cost from round 4', () => {
    const card = res.getCardById('double-turn-plow-a020')
    const game = t.fixture()
    t.setBoard(game, { round: 5 })
    game.run()

    game.state.round = 4
    const cost = card.getSpecialCost(null, game)
    expect(cost).toEqual({ grain: 1, food: 1 })
  })
})
