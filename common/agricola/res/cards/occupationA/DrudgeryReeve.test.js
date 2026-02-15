const t = require('../../../testutil_v2.js')

describe('Drudgery Reeve', () => {
  test('onPlay gives 4 wood when 9+ rounds left', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Lessons A'],
      dennis: {
        hand: ['drudgery-reeve-a136'],
        occupations: [],
        wood: 0,
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Drudgery Reeve')

    t.testBoard(game, {
      dennis: {
        occupations: ['drudgery-reeve-a136'],
        wood: 4,
      },
    })
  })

  test('getEndGamePointsAllPlayers: 1 VP for 1+ of each building resource', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: { occupations: ['drudgery-reeve-a136'] },
      micah: { wood: 1, clay: 1, reed: 1, stone: 1 },
    })
    game.run()

    t.testBoard(game, {
      dennis: { occupations: ['drudgery-reeve-a136'] },
      micah: { score: -13, wood: 1, clay: 1, reed: 1, stone: 1 },
    })
  })

  test('getEndGamePointsAllPlayers: 3 VP for 2+ of each building resource', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: { occupations: ['drudgery-reeve-a136'] },
      micah: { wood: 2, clay: 2, reed: 2, stone: 2 },
    })
    game.run()

    t.testBoard(game, {
      dennis: { occupations: ['drudgery-reeve-a136'] },
      micah: { score: -11, wood: 2, clay: 2, reed: 2, stone: 2 },
    })
  })

  test('getEndGamePointsAllPlayers: 5 VP for 3+ of each building resource', () => {
    const game = t.fixture({ cardSets: ['occupationA'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: { occupations: ['drudgery-reeve-a136'] },
      micah: { wood: 3, clay: 3, reed: 3, stone: 3 },
    })
    game.run()

    t.testBoard(game, {
      dennis: { occupations: ['drudgery-reeve-a136'] },
      micah: { score: -9, wood: 3, clay: 3, reed: 3, stone: 3 },
    })
  })
})
