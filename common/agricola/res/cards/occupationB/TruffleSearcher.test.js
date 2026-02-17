const t = require('../../../testutil_v2.js')

describe('Truffle Searcher', () => {
  test('holds boar equal to completed feeding phases', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['truffle-searcher-b086'],
        food: 10,
      },
      micah: { food: 10 },
      actionSpaces: [{ ref: 'Pig Market', accumulated: 3 }],
    })
    game.run()

    // Pig Market (stage 3) auto-fills stages 1-2 = 7 cards + Pig Market = 8 total.
    // Target round = 8. Feeding phases < 8 = [4, 7] = 2. Capacity = 2 on card.
    // Dennis takes 3 boar: 1 pet + 2 on Truffle Searcher = 3 (all fit, no overflow).
    t.choose(game, 'Pig Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['truffle-searcher-b086'],
        pet: 'boar',
        food: 10,
        animals: { boar: 3 },
      },
    })
  })

  test('only holds boar, not other animal types', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['truffle-searcher-b086'],
        food: 10,
        pet: 'sheep',
      },
      micah: { food: 10 },
      actionSpaces: [{ ref: 'Pig Market', accumulated: 2 }],
    })
    game.run()

    // Pet slot occupied by sheep. Truffle Searcher holds boar only, capacity = 2.
    // Dennis takes 2 boar: both go on card (pet occupied).
    t.choose(game, 'Pig Market')

    t.testBoard(game, {
      dennis: {
        occupations: ['truffle-searcher-b086'],
        pet: 'sheep',
        food: 10,
        animals: { sheep: 1, boar: 2 },
      },
    })
  })
})
