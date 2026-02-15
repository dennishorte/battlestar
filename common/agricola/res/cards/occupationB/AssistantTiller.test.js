const t = require('../../../testutil_v2.js')

describe('Assistant Tiller', () => {
  // Card text: "Each time you use the 'Day Laborer' action space, you can
  // also plow 1 field."
  // Card is 1+ players.

  test('Day Laborer with Assistant Tiller allows plowing 1 field', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['assistant-tiller-b091'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Plow 1 field')
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['assistant-tiller-b091'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('Day Laborer with Assistant Tiller plow can be skipped', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['assistant-tiller-b091'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['assistant-tiller-b091'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['assistant-tiller-b091'],
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 3,
        occupations: ['assistant-tiller-b091'],
      },
    })
  })
})
