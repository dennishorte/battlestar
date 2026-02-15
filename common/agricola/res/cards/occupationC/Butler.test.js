const t = require('../../../testutil_v2.js')

describe('Butler', () => {
  // Card text: "If you play this card in round 11 or before, during scoring,
  // you get 4 bonus points if you then have more rooms than people."

  test('scores 4 BP when played early and rooms > people', () => {
    // Play Butler from hand, then check score with 3 rooms, 2 family
    // Base score: -14. Butler: +4 (rooms > family). Total: -10.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        hand: ['butler-c100'],
        food: 10,
        farmyard: {
          rooms: [{ row: 0, col: 1 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Butler')

    t.testBoard(game, {
      dennis: {
        occupations: ['butler-c100'],
        food: 10,
        score: -9,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
        },
      },
    })
  })

  test('scores 0 BP when rooms equal people', () => {
    // Base score: -14. Butler: 0 (rooms = family). Total: -14.
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        hand: ['butler-c100'],
        food: 10,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Butler')

    t.testBoard(game, {
      dennis: {
        occupations: ['butler-c100'],
        food: 10,
        score: -14,
      },
    })
  })
})
