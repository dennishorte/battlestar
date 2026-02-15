const t = require('../../../testutil_v2.js')

describe('Animal Catcher', () => {
  // Card text: "Each time you use the 'Day Laborer' action space, instead of
  // 2 food, you can get 3 different animals from the general supply. If you do,
  // you must pay 1 food each harvest left to play."

  test('offers animals for food on Day Laborer', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: ['Grain Utilization'],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['animal-catcher-c168'],
        food: 10,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }] },
            { spaces: [{ row: 1, col: 3 }] },
          ],
          stables: [{ row: 1, col: 3 }],
        },
      },
      micah: { food: 10 },
    })
    game.run()

    // Round 2: 6 harvests remaining. Pay 6 food for 3 animals.
    t.choose(game, 'Day Laborer')
    t.choose(game, 'Pay 6 food for 1 sheep, 1 boar, 1 cattle')

    t.testBoard(game, {
      dennis: {
        food: 6,  // 10 + 2 day laborer - 6 for animals
        occupations: ['animal-catcher-c168'],
        pet: 'cattle',
        animals: { sheep: 1, boar: 1, cattle: 1 },
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
            { spaces: [{ row: 1, col: 3 }], boar: 1 },
          ],
          stables: [{ row: 1, col: 3 }],
        },
      },
    })
  })
})
