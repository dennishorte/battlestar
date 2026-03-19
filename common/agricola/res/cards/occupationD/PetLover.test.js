const t = require('../../../testutil_v2.js')

test('gets 3 food + 1 grain when taking 1 sheep, space retains animal', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    dennis: {
      occupations: ['pet-lover-d138'],
    },
  })
  game.run()
  t.choose(game, 'Sheep Market')
  t.choose(game, 'Leave sheep on space: get 1 sheep + 3 food + 1 grain')
  t.choose(game, 'Day Laborer')  // micah
  t.choose(game, 'Forest')       // dennis
  t.choose(game, 'Clay Pit')     // micah
  // Space should retain the sheep (restored by Pet Lover)
  // Normal: space resets to 0 after take, then +1 from round 2 accumulation = 1
  // With Pet Lover: +1 restored to space, then +1 from round 2 = 2
  expect(game.state.actionSpaces['take-sheep'].accumulated).toBe(2)
  t.testBoard(game, {
    dennis: {
      occupations: ['pet-lover-d138'],
      pet: 'sheep',
      animals: { sheep: 1 },
      wood: 3,
      food: 3,
      grain: 1,
    },
  })
})

test('can skip bonus', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    dennis: {
      occupations: ['pet-lover-d138'],
    },
  })
  game.run()
  t.choose(game, 'Sheep Market')
  t.choose(game, 'Skip')
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Forest')
  t.choose(game, 'Clay Pit')
  t.testBoard(game, {
    dennis: {
      occupations: ['pet-lover-d138'],
      pet: 'sheep',
      animals: { sheep: 1 },
      wood: 3,
    },
  })
})

test('does not trigger with more than 1 animal', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    actionSpaces: [{ ref: 'Sheep Market', accumulated: 2 }],
    dennis: {
      occupations: ['pet-lover-d138'],
      farmyard: {
        pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
      },
    },
  })
  game.run()
  t.choose(game, 'Sheep Market')
  // No PetLover prompt — 2 sheep, not 1
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Forest')
  t.choose(game, 'Clay Pit')
  t.testBoard(game, {
    dennis: {
      occupations: ['pet-lover-d138'],
      animals: { sheep: 2 },
      wood: 3,
      food: 0,
      grain: 0,
      farmyard: {
        pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }], sheep: 2 }],
      },
    },
  })
})
