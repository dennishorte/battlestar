const t = require('../../../testutil_v2.js')

describe('Recreational Carpenter', () => {
  test('offers room building at end of work phase when not using Meeting Place', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['recreational-carpenter-d130'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    // dennis: Day Laborer (+2 food)
    t.choose(game, 'Day Laborer')
    // micah: Forest
    t.choose(game, 'Forest')
    // dennis: Grain Seeds (+1 grain)
    t.choose(game, 'Grain Seeds')
    // micah: Clay Pit
    t.choose(game, 'Clay Pit')

    // End of work phase: RecreationalCarpenter fires (dennis not on Meeting Place)
    // buildRoomAndOrStable offers choices
    t.choose(game, 'Build Room')
    t.action(game, 'build-room', { row: 2, col: 0 })

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['recreational-carpenter-d130'],
        wood: 0,  // 5 - 5
        reed: 0,  // 2 - 2
        food: 2,  // from Day Laborer
        grain: 1, // from Grain Seeds
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })

  test('no room building when Meeting Place was used', () => {
    const game = t.fixture({ cardSets: ['occupationD', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['recreational-carpenter-d130'],
        wood: 5,
        reed: 2,
      },
    })
    game.run()

    // dennis: Meeting Place (minor improvement auto-skips since no minors in hand)
    t.choose(game, 'Meeting Place')
    // micah: Day Laborer
    t.choose(game, 'Day Laborer')
    // dennis: Grain Seeds (+1 grain)
    t.choose(game, 'Grain Seeds')
    // micah: Forest
    t.choose(game, 'Forest')

    // End of work phase: RecreationalCarpenter checks → Meeting Place occupied by dennis → NO offer

    t.testBoard(game, {
      round: 2,
      dennis: {
        occupations: ['recreational-carpenter-d130'],
        wood: 5,  // unchanged
        reed: 2,  // unchanged
        food: 1,  // from Meeting Place
        grain: 1, // from Grain Seeds
      },
    })
  })
})
