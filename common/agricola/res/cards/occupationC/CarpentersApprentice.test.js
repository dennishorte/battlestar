const t = require('../../../testutil_v2.js')

describe("Carpenter's Apprentice", () => {
  // Card text: "Wood rooms cost you 2 woods less. Your 3rd and 4th stable each
  // cost you 1 wood less. Your 13th to 15th fence each cost you nothing."

  test('fences below 13 cost normal rate', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      actionSpaces: ['Fencing'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        wood: 4,
      },
    })
    game.run()

    // Build a single-space pasture in corner
    t.choose(game, 'Fencing')
    t.action(game, 'build-pasture', { spaces: [{ row: 0, col: 4 }] })

    t.testBoard(game, {
      dennis: {
        occupations: ['carpenters-apprentice-c088'],
        wood: 3,
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 4 }] }],
        },
      },
    })
  })

  test.todo('modifyRoomCost reduces wood for rooms - hook not fired by engine')
  test.todo('modifyStableCost reduces cost for 3rd/4th stables - hook not fired by engine')
})
