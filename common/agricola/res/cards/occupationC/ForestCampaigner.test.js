const t = require('../../../testutil_v2.js')

describe('Forest Campaigner', () => {
  // Card text: "Each time before you place a person, if there are at least
  // 8 wood total on accumulation spaces, you get 1 food."

  test('gives 1 food before action when 8+ wood on accumulation spaces', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        { ref: 'Forest', accumulated: 8 },
        'Grain Utilization',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-campaigner-c158'],
        food: 0,
      },
    })
    game.run()

    // dennis places person: 8 wood on Forest → gets 1 food before action
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-campaigner-c158'],
        food: 3,  // 1 from Forest Campaigner + 2 from Day Laborer
      },
    })
  })

  test('does not give food when less than 8 wood on accumulation spaces', () => {
    const game = t.fixture({ numPlayers: 4, cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: [
        { ref: 'Forest', accumulated: 2 },
        'Grain Utilization',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['forest-campaigner-c158'],
        food: 0,
      },
    })
    game.run()

    // 4-player game: Forest=2, Copse=1, Grove=2 → total 5 < 8 → no bonus
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-campaigner-c158'],
        food: 2,  // Only 2 from Day Laborer, no Forest Campaigner bonus
      },
    })
  })
})
