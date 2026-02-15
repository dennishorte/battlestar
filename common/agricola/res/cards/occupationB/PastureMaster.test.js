const t = require('../../../testutil_v2.js')

describe('Pasture Master', () => {
  // Card text: "Each time you renovate, you get 1 additional animal of the
  // respective type in each of your pastures with stable."
  // Uses onRenovate hook. Card is 4+ players.

  test('gains 1 additional animal per pasture with stable on renovation', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pasture-master-b168'],
        clay: 5,
        reed: 5,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
          ],
          stables: [{ row: 0, col: 3 }],
        },
      },
    })
    game.run()

    // Renovate wood → clay
    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Do not play an improvement')

    t.testBoard(game, {
      dennis: {
        occupations: ['pasture-master-b168'],
        roomType: 'clay',
        clay: 3,   // 5 - 2 (renovation)
        reed: 4,   // 5 - 1 (renovation)
        animals: { sheep: 2 },  // 1 + 1 from Pasture Master
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 2 },
          ],
          stables: [{ row: 0, col: 3 }],
        },
      },
    })
  })

  test('does not add animals to pastures without stable', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      actionSpaces: [
        'Grain Utilization', 'Sheep Market', 'Fencing', 'Major Improvement',
        'House Redevelopment',
      ],
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['pasture-master-b168'],
        clay: 5,
        reed: 5,
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
          ],
          // No stables
        },
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')
    t.choose(game, 'Do not play an improvement')

    t.testBoard(game, {
      dennis: {
        occupations: ['pasture-master-b168'],
        roomType: 'clay',
        clay: 3,
        reed: 4,
        animals: { sheep: 1 },  // unchanged — no stable in pasture
        farmyard: {
          pastures: [
            { spaces: [{ row: 0, col: 3 }, { row: 0, col: 4 }], sheep: 1 },
          ],
        },
      },
    })
  })
})
