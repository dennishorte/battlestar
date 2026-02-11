const t = require('../../../testutil_v2.js')

describe('Brook', () => {
  test('gives 1 extra food when using Reed Bank', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brook-b056'],
      },
    })
    game.run()

    // Dennis uses Fishing first (to satisfy personOnFishing prereq during play)
    t.choose(game, 'Fishing')
    // Micah takes action
    t.choose(game, 'Day Laborer')
    // Dennis uses Reed Bank — triggers Brook
    t.choose(game, 'Reed Bank')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Fishing + 1 from Brook
        reed: 1, // from Reed Bank
        minorImprovements: ['brook-b056'],
      },
    })
  })

  test('gives 1 extra food when using Clay Pit', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brook-b056'],
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Clay Pit')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Fishing + 1 from Brook
        clay: 1, // from Clay Pit
        minorImprovements: ['brook-b056'],
      },
    })
  })

  test('gives 1 extra food when using Forest', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brook-b056'],
      },
    })
    game.run()

    t.choose(game, 'Fishing')
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Fishing + 1 from Brook
        wood: 3, // from Forest
        minorImprovements: ['brook-b056'],
      },
    })
  })

  test('no extra food when using non-qualifying action', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['brook-b056'],
      },
    })
    game.run()

    // Dennis uses a non-qualifying action space
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2, // only from Day Laborer
        minorImprovements: ['brook-b056'],
      },
    })
  })

  test('prereq: must have person on Fishing to play', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['brook-b056'],
      },
    })
    game.run()

    // Dennis uses Fishing (places person on fishing)
    t.choose(game, 'Fishing')
    // Micah takes action
    t.choose(game, 'Day Laborer')
    // Dennis uses Meeting Place and can now play Brook (person on fishing)
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Brook')

    t.testBoard(game, {
      dennis: {
        food: 2, // 1 from Fishing + 1 from Meeting Place
        minorImprovements: ['brook-b056'],
      },
    })
  })
})
