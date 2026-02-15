const t = require('../../../testutil_v2.js')

describe('Cooperative Plower', () => {
  // Card text: "Each time you use the 'Farmland' action space while the
  // 'Grain Seeds' action space is occupied, you can plow 1 additional field."
  // Card is 1+ players.

  test('Farmland with Grain Seeds occupied allows plowing additional field', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['cooperative-plower-b090'],
      },
    })
    game.run()

    // micah takes Grain Seeds to occupy it
    t.choose(game, 'Grain Seeds')

    // dennis takes Farmland — gets normal plow + Cooperative Plower bonus
    t.choose(game, 'Farmland')
    // Normal plow from Farmland
    t.choose(game, '2,0')
    // Cooperative Plower offers additional plow
    t.choose(game, 'Plow 1 field')
    t.choose(game, '2,1')

    t.testBoard(game, {
      dennis: {
        occupations: ['cooperative-plower-b090'],
        farmyard: {
          fields: [{ row: 2, col: 0 }, { row: 2, col: 1 }],
        },
      },
    })
  })

  test('Farmland without Grain Seeds occupied does not offer bonus plow', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cooperative-plower-b090'],
      },
    })
    game.run()

    // dennis takes Farmland — Grain Seeds is NOT occupied
    t.choose(game, 'Farmland')
    // Normal plow from Farmland (no Cooperative Plower bonus)
    t.choose(game, '2,0')

    t.testBoard(game, {
      dennis: {
        occupations: ['cooperative-plower-b090'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
        },
      },
    })
  })

  test('does not trigger on other action spaces', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['cooperative-plower-b090'],
      },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        occupations: ['cooperative-plower-b090'],
      },
    })
  })
})
