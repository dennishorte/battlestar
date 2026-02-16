const t = require('../../../testutil_v2.js')

test('gets 3 food + 1 grain when taking 1 sheep', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    actionSpaces: [{ ref: 'Sheep Market', accumulated: 1 }],
    dennis: {
      occupations: ['pet-lover-d138'],
    },
  })
  game.run()
  t.choose(game, 'Sheep Market')
  // 1 sheep auto-places as pet. onAction fires — PetLover sees 1 sheep
  t.choose(game, 'Get bonus: 3 food + 1 grain (Pet Lover)')
  t.choose(game, 'Day Laborer')  // micah
  t.choose(game, 'Forest')       // dennis
  t.choose(game, 'Clay Pit')     // micah
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
