const t = require('../../../testutil_v2.js')

describe('Legworker', () => {
  // Card text: "Each time you use an action space that is orthogonally adjacent
  // to another action space occupied by one of your people, you get 1 wood."
  //
  // In a 2p layout:
  //   Col 0 (Fixed)          Col 1 (Accumulating)
  //   build-room-stable 0-2
  //   starting-player   2-4
  //   take-grain        4-6  take-wood 4-6
  //   plow-field        6-8  take-clay 6-8
  //   occupation        8-10 take-reed 8-10
  //   day-laborer      10-12 fishing   10-12

  test('gets 1 wood when using space vertically adjacent to own occupied space', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['legworker-c117'],
      },
    })
    game.run()

    t.choose(game, 'Forest')      // dennis takes Forest (col 1, rows 4-6)
    t.choose(game, 'Grain Seeds') // micah
    t.choose(game, 'Clay Pit')    // dennis takes Clay Pit (col 1, rows 6-8) → adjacent to Forest

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 4,  // 3 from Forest + 1 from Legworker
        clay: 1,  // from Clay Pit
        occupations: ['legworker-c117'],
      },
    })
  })

  test('gets 1 wood when using space horizontally adjacent to own occupied space', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['legworker-c117'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')  // dennis takes Grain Seeds (col 0, rows 4-6)
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Forest')       // dennis takes Forest (col 1, rows 4-6) → adjacent to Grain Seeds

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 4,   // 3 from Forest + 1 from Legworker
        grain: 1,  // from Grain Seeds
        occupations: ['legworker-c117'],
      },
    })
  })

  test('does not trigger when no own person is on any adjacent space', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['legworker-c117'],
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')  // dennis takes Grain Seeds (col 0, rows 4-6)
    t.choose(game, 'Clay Pit')     // micah
    t.choose(game, 'Fishing')      // dennis takes Fishing (col 1, rows 10-12) → NOT adjacent

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,   // no Legworker bonus
        grain: 1,  // from Grain Seeds
        food: 1,   // from Fishing (1 accumulated)
        occupations: ['legworker-c117'],
      },
    })
  })

  test('does not trigger when opponent occupies adjacent space', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['legworker-c117'],
      },
    })
    game.run()

    t.choose(game, 'Forest')    // micah takes Forest (col 1, rows 4-6)
    t.choose(game, 'Clay Pit')  // dennis takes Clay Pit (col 1, rows 6-8) → adjacent to Forest (micah's)

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        wood: 0,  // no Legworker bonus (opponent's worker, not own)
        clay: 1,  // from Clay Pit
        occupations: ['legworker-c117'],
      },
    })
  })

  test('gives only 1 wood even with multiple adjacent occupied spaces', () => {
    const game = t.fixture({ cardSets: ['occupationC'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['legworker-c117'],
        familyMembers: 3,
      },
    })
    game.run()

    t.choose(game, 'Grain Seeds')  // dennis takes Grain Seeds (col 0, rows 4-6)
    t.choose(game, 'Day Laborer')  // micah
    t.choose(game, 'Clay Pit')     // dennis takes Clay Pit (col 1, rows 6-8) → not adjacent to Grain Seeds
    t.choose(game, 'Fishing')      // micah
    t.choose(game, 'Forest')       // dennis takes Forest (col 1, rows 4-6) → adjacent to BOTH Grain Seeds AND Clay Pit

    t.testBoard(game, {
      dennis: {
        wood: 4,   // 3 from Forest + 1 from Legworker (only 1, not 2)
        grain: 1,
        clay: 1,
        occupations: ['legworker-c117'],
        familyMembers: 3,
      },
    })
  })
})
