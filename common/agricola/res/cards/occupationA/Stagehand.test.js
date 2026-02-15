const t = require('../../../testutil_v2.js')

describe('Stagehand', () => {
  test('onAnyAction offers build choice when another player uses Traveling Players', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['stagehand-a150'],
      },
      micah: { food: 5 },
      scott: { food: 5 },
      eliya: { food: 5 },
    })
    game.run()

    t.choose(game, 'Traveling Players')   // micah
    t.choose(game, 'Skip')               // dennis declines build

    t.testBoard(game, {
      dennis: { occupations: ['stagehand-a150'] },
      micah: { food: 6 },
    })
  })

  test('can take Build Rooms action', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['stagehand-a150'],
        roomType: 'wood',
        wood: 5,
        reed: 2,
      },
      micah: { food: 5 },
      scott: { food: 5 },
      eliya: { food: 5 },
    })
    game.run()

    t.choose(game, 'Traveling Players')
    t.choose(game, 'Build Rooms')
    t.choose(game, '0,1')

    t.testBoard(game, {
      dennis: {
        occupations: ['stagehand-a150'],
        wood: 0,
        reed: 0,
        farmyard: { rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }] },
      },
      micah: { food: 6 },
    })
  })
})
