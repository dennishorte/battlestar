const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Seducer', () => {
  test('onPlay in round 5+ with resources pays for Family Growth without Room', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['seducer-b127'],
        stone: 1,
        grain: 1,
        vegetables: 1,
        food: 5,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      const lessonsA = res.getActionById('occupation')
      if (lessonsA) {
        g.state.roundCardDeck[4] = lessonsA
      }
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Seducer')
    t.choose(game, 'Pay 1 stone, 1 grain, 1 vegetable, 1 sheep for Family Growth without Room')

    t.testBoard(game, {
      dennis: {
        occupations: ['seducer-b127'],
        familyMembers: 3,
        food: 5,
        stone: 0,
        grain: 0,
        vegetables: 0,
        animals: { sheep: 0 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
  })

  test('onPlay in round 5+ Skip does not grow family', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['seducer-b127'],
        stone: 1,
        grain: 1,
        vegetables: 1,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
    game.testSetBreakpoint('initialization-complete', (g) => {
      const lessonsA = res.getActionById('occupation')
      if (lessonsA) {
        g.state.roundCardDeck[4] = lessonsA
      }
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Seducer')
    t.choose(game, 'Skip')

    t.testBoard(game, {
      dennis: {
        occupations: ['seducer-b127'],
        familyMembers: 2,
        stone: 1,
        grain: 1,
        vegetables: 1,
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
  })

  test('onPlay before round 5 does not offer', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['seducer-b127'],
        stone: 1,
        grain: 1,
        vegetables: 1,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Seducer')

    // No offer when round < 5; family unchanged
    t.testBoard(game, {
      dennis: {
        occupations: ['seducer-b127'],
        familyMembers: 2,
        stone: 1,
        grain: 1,
        vegetables: 1,
        animals: { sheep: 1 },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
        },
      },
    })
  })
})
