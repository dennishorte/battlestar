const t = require('../../../testutil_v2.js')

describe('Cottager', () => {
  // Card text: "Each time you use the 'Day Laborer' action space, you can
  // also either build exactly 1 room or renovate your house. Either way,
  // you have to pay the cost."
  // Card is 1+ players.

  test('Day Laborer with Cottager allows building 1 room', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cottager-b087'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Build 1 Room')
    t.choose(game, '0,1')  // build at row 0, col 1

    t.testBoard(game, {
      dennis: {
        food: 2,  // from Day Laborer
        occupations: ['cottager-b087'],
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('Day Laborer with Cottager allows renovating house', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cottager-b087'],
        clay: 3,
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Renovate')

    t.testBoard(game, {
      dennis: {
        food: 2,  // from Day Laborer
        clay: 1,  // 3 - 2 (renovation costs 1 clay per room + 1 reed)
        roomType: 'clay',
        occupations: ['cottager-b087'],
      },
    })
  })

  test('Day Laborer with Cottager can be skipped', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cottager-b087'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        food: 2,
        wood: 5,
        reed: 2,
        occupations: ['cottager-b087'],
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cottager-b087'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        wood: 8,  // 5 + 3 from Forest
        reed: 2,
        occupations: ['cottager-b087'],
      },
    })
  })
})
