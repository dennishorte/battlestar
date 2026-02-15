const t = require('../../../testutil_v2.js')

describe('Patch Caretaker', () => {
  // Same good type = stone. Western Quarry (take-stone-1) and Eastern Quarry (take-stone-2) both in round 11.
  test('onAction gives 1 vegetable when using second accumulation space of same good type in work phase', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 11,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['patch-caretaker-a161'],
        vegetables: 0,
      },
      micah: {},
      scott: {},
    })
    game.run()

    t.choose(game, 'Western Quarry')   // dennis: first stone accumulation
    t.choose(game, 'Day Laborer')      // micah
    t.choose(game, 'Grain Seeds')      // scott
    t.choose(game, 'Eastern Quarry')   // dennis: second stone accumulation → +1 vegetable

    t.testBoard(game, {
      dennis: {
        occupations: ['patch-caretaker-a161'],
        stone: 2,
        vegetables: 1,
      },
    })
  })

  test('does not give vegetable on first use of a good type in the work phase', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 11,
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['patch-caretaker-a161'],
        vegetables: 0,
      },
      micah: {},
      scott: {},
    })
    game.run()

    t.choose(game, 'Western Quarry')   // dennis: only stone use this phase
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Grain Seeds')
    t.choose(game, 'Forest')          // dennis: wood, not second stone

    t.testBoard(game, {
      dennis: {
        occupations: ['patch-caretaker-a161'],
        stone: 1,
        wood: 3,
        vegetables: 0,
      },
    })
  })
})
