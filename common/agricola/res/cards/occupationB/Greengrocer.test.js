const t = require('../../../testutil_v2.js')

describe('Greengrocer', () => {
  // Card text: "Each time you use the 'Grain Seeds' action space, you also
  // get 1 vegetable."
  // Card is 3+ players.

  test('Grain Seeds gives 1 bonus vegetable', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['greengrocer-b142'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')

    t.testBoard(game, {
      dennis: {
        grain: 1,       // from Grain Seeds
        vegetables: 1,  // bonus from Greengrocer
        occupations: ['greengrocer-b142'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture({ numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['greengrocer-b142'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['greengrocer-b142'],
      },
    })
  })
})
