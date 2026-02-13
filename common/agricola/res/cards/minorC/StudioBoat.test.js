const t = require('../../../testutil_v2.js')

describe('StudioBoat', () => {
  test('gives 1 bonus point when using Traveling Players', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['studio-boat-c039'],
        occupations: ['test-occupation-1'],
        food: 10,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.run()

    t.choose(game, 'Traveling Players')

    t.testBoard(game, {
      dennis: {
        bonusPoints: 1,
        food: 11, // 10 starting + 1 from Traveling Players
        occupations: ['test-occupation-1'],
        minorImprovements: ['studio-boat-c039'],
      },
    })
  })

  test('no bonus point for other actions', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['minorImprovementC', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['studio-boat-c039'],
        occupations: ['test-occupation-1'],
        food: 10,
      },
      micah: { food: 10 },
      scott: { food: 10 },
      eliya: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        bonusPoints: 0,
        food: 12, // 10 starting + 2 from Day Laborer
        occupations: ['test-occupation-1'],
        minorImprovements: ['studio-boat-c039'],
      },
    })
  })
})
