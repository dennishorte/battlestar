const t = require('../../../testutil_v2.js')

test('grows family after person action in round 5', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 5,
    dennis: {
      occupations: ['child-ombudsman-d092'],
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      },
    },
  })
  game.run()
  t.choose(game, 'Day Laborer')
  // onPersonActionEnd fires — round 5, has room → offer
  t.choose(game, 'Grow family (2 begging cards)')
  t.choose(game, 'Forest')       // micah
  t.choose(game, 'Grain Seeds')  // dennis
  // After 2nd action: no room (3 rooms, 3 members) → no prompt
  t.choose(game, 'Clay Pit')     // micah
  t.testBoard(game, {
    dennis: {
      occupations: ['child-ombudsman-d092'],
      familyMembers: 3,
      beggingCards: 2,
      food: 2,
      grain: 1,
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      },
    },
  })
})

test('can skip family growth', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 5,
    dennis: {
      occupations: ['child-ombudsman-d092'],
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      },
    },
  })
  game.run()
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Skip')
  t.choose(game, 'Forest')
  t.choose(game, 'Grain Seeds')
  t.choose(game, 'Skip')
  t.choose(game, 'Clay Pit')
  t.testBoard(game, {
    dennis: {
      occupations: ['child-ombudsman-d092'],
      familyMembers: 2,
      beggingCards: 0,
      food: 2,
      grain: 1,
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      },
    },
  })
})

test('does not trigger before round 5', () => {
  const game = t.fixture({ cardSets: ['occupationD', 'test'] })
  t.setBoard(game, {
    round: 4,
    dennis: {
      occupations: ['child-ombudsman-d092'],
      food: 4,
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      },
    },
  })
  game.run()
  t.choose(game, 'Day Laborer')
  t.choose(game, 'Forest')
  t.choose(game, 'Grain Seeds')
  t.choose(game, 'Clay Pit')
  // Harvest, no ChildOmbudsman prompt
  t.testBoard(game, {
    dennis: {
      occupations: ['child-ombudsman-d092'],
      familyMembers: 2,
      food: 2, // 4 + 2(DL) - 4(feeding)
      grain: 1,
      farmyard: {
        rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      },
    },
  })
})
