const t = require('../../../testutil_v2.js')

describe('Roof Ballaster', () => {
  test('onPlay pay 1 food gives 1 stone per room (2 rooms)', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['roof-ballaster-b123'],
        food: 2,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Roof Ballaster')
    t.choose(game, 'Pay 1 food to get 1 stone per room')

    t.testBoard(game, {
      dennis: {
        occupations: ['roof-ballaster-b123'],
        food: 1,
        stone: 2,
      },
    })
  })

  test('onPlay Skip does not pay or gain stone', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['roof-ballaster-b123'],
        food: 2,
        stone: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Roof Ballaster')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['roof-ballaster-b123'],
        food: 2,
        stone: 0,
      },
    })
  })
})
