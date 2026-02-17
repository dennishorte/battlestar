const t = require('../../../testutil_v2.js')

describe('Woolgrower', () => {
  test('holds 0 sheep before any feeding phase', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['woolgrower-a148'],
      },
      micah: { food: 10 },
      alex: { food: 10 },
      actionSpaces: [{ ref: 'Sheep Market', accumulated: 2 }],
    })
    game.run()

    // Round 1: 0 completed feeding phases → Woolgrower capacity 0.
    // Dennis takes Sheep Market (2 sheep). With no pastures, only 1 fits (pet).
    // The extra sheep is lost (no placement available).
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['woolgrower-a148'],
        pet: 'sheep',
        animals: { sheep: 1 },
      },
    })
  })

  test('holds sheep after completed feeding phase', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['woolgrower-a148'],
        food: 10,
      },
      micah: { food: 10 },
      alex: { food: 10 },
      actionSpaces: ['House Redevelopment', { ref: 'Sheep Market', accumulated: 3 }],
    })
    game.run()

    // Round 6 (after round 4 harvest): 1 completed feeding phase → capacity 1.
    // Dennis takes Sheep Market (3 sheep). 1 as pet + 1 on Woolgrower = 2 kept.
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['woolgrower-a148'],
        pet: 'sheep',
        food: 10,
        animals: { sheep: 2 },
      },
    })
  })
})
