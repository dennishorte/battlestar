const t = require('../../../testutil_v2.js')

describe('Sheep Whisperer', () => {
  // Card text: "Add 2, 5, 8, and 10 to the current round and place 1 sheep
  // on each corresponding round space. At the start of these rounds, you get
  // the sheep."
  // Card is 4+ players.

  test('onPlay schedules sheep at current round + 2, 5, 8, 10', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sheep-whisperer-b164'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Sheep Whisperer')

    // Played in round 2 → schedules sheep at rounds 4, 7, 10, 12
    t.testBoard(game, {
      dennis: {
        occupations: ['sheep-whisperer-b164'],
        scheduled: {
          sheep: { 4: 1, 7: 1, 10: 1, 12: 1 },
        },
      },
    })
  })

  test('sheep scheduled past round 14 are not delivered', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 10,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sheep-whisperer-b164'],
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Sheep Whisperer')

    // Played in round 10 → round+2=12, round+5=15(>14), round+8=18(>14), round+10=20(>14)
    // Only round 12 gets scheduled
    t.testBoard(game, {
      dennis: {
        occupations: ['sheep-whisperer-b164'],
        scheduled: {
          sheep: { 12: 1 },
        },
      },
    })
  })

  test('scheduled sheep is collected at round start', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['sheep-whisperer-b164'],
        scheduled: { sheep: { 5: 1, 8: 1 } },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
    })
    game.run()

    // Round 5 start: scheduled sheep delivered (+1)
    t.testBoard(game, {
      dennis: {
        occupations: ['sheep-whisperer-b164'],
        animals: { sheep: 1 },
        scheduled: { sheep: { 8: 1 } },
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 1 }],
        },
      },
    })
  })
})
