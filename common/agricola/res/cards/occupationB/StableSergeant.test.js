const t = require('../../../testutil_v2.js')

describe('Stable Sergeant', () => {
  // Card text: "When you play this card, you can pay 2 food to get 1 sheep,
  // 1 wild boar, and 1 cattle, but only if you can accommodate all three
  // animals on your farm."
  // Card is 4+ players.

  test('onPlay with enough food and capacity gives all 3 animals for 2 food', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stable-sergeant-b167'],
        food: 5,
        farmyard: {
          // 3 separate pastures with stables so each animal type can go in one
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
            { spaces: [{ row: 1, col: 2 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
          stables: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stable Sergeant')
    t.choose(game, 'Pay 2 food for 1 sheep, 1 boar, 1 cattle')

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-sergeant-b167'],
        food: 3,  // 5 - 2
        animals: { sheep: 1, boar: 1, cattle: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }], sheep: 1 },
            { spaces: [{ row: 1, col: 2 }], boar: 1 },
            { spaces: [{ row: 2, col: 2 }], cattle: 1 },
          ],
          stables: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        },
      },
    })
  })

  test('player can decline the animal offer', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stable-sergeant-b167'],
        food: 5,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
            { spaces: [{ row: 1, col: 2 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
          stables: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stable Sergeant')
    t.choose(game, 'Decline')

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-sergeant-b167'],
        food: 5,  // unchanged
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
            { spaces: [{ row: 1, col: 2 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
          stables: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        },
      },
    })
  })

  test('onPlay with less than 2 food does not offer animals', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stable-sergeant-b167'],
        food: 1,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
            { spaces: [{ row: 1, col: 2 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
          stables: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stable Sergeant')
    // No prompt for animals — card played but no offer

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-sergeant-b167'],
        food: 1,  // unchanged
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 2 }] },
            { spaces: [{ row: 1, col: 2 }] },
            { spaces: [{ row: 2, col: 2 }] },
          ],
          stables: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        },
      },
    })
  })

  test('onPlay without capacity for all 3 animals does not offer', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['stable-sergeant-b167'],
        food: 5,
        // No pastures — can only hold 1 pet, not 3 animals
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Stable Sergeant')
    // No prompt — can't accommodate all 3 animals

    t.testBoard(game, {
      dennis: {
        occupations: ['stable-sergeant-b167'],
        food: 5,  // unchanged — no pastures, no offer
      },
    })
  })
})
