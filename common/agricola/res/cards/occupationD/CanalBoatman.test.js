const t = require('../../../testutil_v2.js')

test('gets 3 stone for 1 food + 1 worker after Fishing', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      occupations: ['canal-boatman-d103'],
      food: 2,
    },
  })
  game.run()
  t.choose(game, 'Fishing')
  // onAction fires — CanalBoatman offers
  t.choose(game, 'Get 3 stone (pay 1 food + 1 worker)')
  // dennis used both workers (1 for Fishing, 1 for CanalBoatman)
  t.choose(game, 'Day Laborer')  // micah
  t.choose(game, 'Forest')       // micah
  t.testBoard(game, {
    round: 2,
    dennis: {
      occupations: ['canal-boatman-d103'],
      stone: 3,
      food: 2, // 2 + 1(Fishing) - 1(CanalBoatman)
    },
  })
})

test('gets grain + vegetable after Reed Bank', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      occupations: ['canal-boatman-d103'],
      food: 2,
    },
  })
  game.run()
  t.choose(game, 'Reed Bank')
  t.choose(game, 'Get 1 grain + 1 vegetable (pay 1 food + 1 worker)')
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Forest')
  t.testBoard(game, {
    round: 2,
    dennis: {
      occupations: ['canal-boatman-d103'],
      reed: 1,
      grain: 1,
      vegetables: 1,
      food: 1, // 2 - 1(CanalBoatman)
    },
  })
})

test('can skip', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 1,
    dennis: {
      occupations: ['canal-boatman-d103'],
      food: 2,
    },
  })
  game.run()
  t.choose(game, 'Fishing')
  t.choose(game, 'Skip')
  t.choose(game, 'Day Laborer')  // micah
  t.choose(game, 'Grain Seeds')  // dennis
  t.choose(game, 'Forest')       // micah
  t.testBoard(game, {
    round: 2,
    dennis: {
      occupations: ['canal-boatman-d103'],
      food: 3, // 2 + 1(Fishing)
      grain: 1,
    },
  })
})
