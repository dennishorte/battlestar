const t = require('../../../testutil_v2.js')

test('takes bonus action after Traveling Players', () => {
  const game = t.fixture({ numPlayers: 4, cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      occupations: ['spin-doctor-d151'],
    },
  })
  game.run()
  // 4 players × 2 workers = 8 actions + 1 SpinDoctor bonus = 9 total
  // dennis worker 1: Traveling Players (1 food)
  t.choose(game, 'Traveling Players')
  // SpinDoctor fires: place bonus worker on Day Laborer (+2 food)
  t.choose(game, 'Day Laborer')
  // dennis now has 0 workers (both used)
  t.choose(game, 'Forest')       // micah worker 1
  t.choose(game, 'Clay Pit')     // scott worker 1
  t.choose(game, 'Grain Seeds')  // eliya worker 1
  // dennis skipped (0 workers)
  t.choose(game, 'Reed Bank')    // micah worker 2
  t.choose(game, 'Copse')        // scott worker 2
  t.choose(game, 'Grove')        // eliya worker 2
  t.testBoard(game, {
    round: 2,
    dennis: {
      occupations: ['spin-doctor-d151'],
      food: 3, // 1 (Traveling Players) + 2 (Day Laborer)
    },
  })
})

test('can skip SpinDoctor bonus', () => {
  const game = t.fixture({ numPlayers: 4, cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      occupations: ['spin-doctor-d151'],
    },
  })
  game.run()
  // dennis worker 1: Traveling Players (1 food)
  t.choose(game, 'Traveling Players')
  // SpinDoctor fires: skip bonus
  t.choose(game, 'Skip')
  t.choose(game, 'Forest')       // micah worker 1
  t.choose(game, 'Day Laborer')  // scott worker 1
  t.choose(game, 'Grain Seeds')  // eliya worker 1
  t.choose(game, 'Fishing')      // dennis worker 2 (1 food)
  t.choose(game, 'Reed Bank')    // micah worker 2
  t.choose(game, 'Copse')        // scott worker 2
  t.choose(game, 'Grove')        // eliya worker 2
  t.testBoard(game, {
    round: 2,
    dennis: {
      occupations: ['spin-doctor-d151'],
      food: 2, // 1 (Traveling Players) + 1 (Fishing)
    },
  })
})
