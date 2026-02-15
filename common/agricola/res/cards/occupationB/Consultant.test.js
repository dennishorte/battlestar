const t = require('../../../testutil_v2.js')

describe('Consultant', () => {
  test('onPlay in 2-player game gives 3 clay', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: { hand: ['consultant-b102'] },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Consultant')

    t.testBoard(game, {
      dennis: {
        occupations: ['consultant-b102'],
        clay: 3,
      },
    })
  })

  test('onPlay in 1-player game gives 2 grain', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 1 })
    t.setBoard(game, {
      dennis: { hand: ['consultant-b102'] },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Consultant')

    t.testBoard(game, {
      dennis: {
        occupations: ['consultant-b102'],
        grain: 2,
      },
    })
  })

  test('onPlay in 4-player game gives 2 sheep when can place', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['consultant-b102'],
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Consultant')
    t.action(game, 'animal-placement', {
      placements: [{ locationId: 'pasture-0', animalType: 'sheep', count: 2 }],
      overflow: {},
    })

    t.testBoard(game, {
      dennis: {
        occupations: ['consultant-b102'],
        animals: { sheep: 2 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }], sheep: 2 },
            { spaces: [{ row: 2, col: 1 }] },
          ],
        },
      },
    })
  })
})
