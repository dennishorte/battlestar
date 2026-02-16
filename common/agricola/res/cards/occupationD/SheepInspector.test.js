const t = require('../../../testutil_v2.js')

test('frees a worker after paying sheep and food', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      occupations: ['sheep-inspector-d093'],
      food: 3,
      farmyard: {
        pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
      },
    },
  })
  game.run()
  t.choose(game, 'Day Laborer')   // dennis action 1 — 1 worker placed, no trigger
  t.choose(game, 'Forest')        // micah action 1
  t.choose(game, 'Grain Seeds')   // dennis action 2 — 2 workers placed, trigger!
  t.choose(game, 'Pay 1 sheep + 2 food to free a worker')
  t.choose(game, 'Clay Pit')      // micah action 2
  // dennis has 1 extra worker, takes action 3
  t.choose(game, 'Fishing')       // dennis action 3
  t.testBoard(game, {
    round: 2,
    dennis: {
      occupations: ['sheep-inspector-d093'],
      food: 4, // 3 + 2(DL) - 2(SI) + 1(Fishing)
      grain: 1,
      animals: { sheep: 1 },
      farmyard: {
        pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 1 }],
      },
    },
  })
})

test('can skip', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      occupations: ['sheep-inspector-d093'],
      food: 3,
      farmyard: {
        pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
      },
    },
  })
  game.run()
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Forest')
  t.choose(game, 'Grain Seeds')
  t.choose(game, 'Skip')
  t.choose(game, 'Clay Pit')
  t.testBoard(game, {
    round: 2,
    dennis: {
      occupations: ['sheep-inspector-d093'],
      food: 5, // 3 + 2(DL)
      grain: 1,
      animals: { sheep: 2 },
      farmyard: {
        pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
      },
    },
  })
})
