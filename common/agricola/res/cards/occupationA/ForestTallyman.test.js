const t = require('../../../testutil_v2.js')

describe('Forest Tallyman', () => {
  // Card is 4+ players. createsActionSpace when Forest and Clay Pit occupied; use gap → 2 clay, 3 wood.

  test('gap space appears when Forest and Clay Pit occupied; use it for 2 clay and 3 wood', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'scott',
      actionSpaces: ['Forest', 'Clay Pit', 'Grain Seeds', 'Reed Bank'],
      dennis: {
        occupations: ['forest-tallyman-a162'],
        wood: 0,
        clay: 0,
        farmyard: {
          pastures: [],
        },
      },
      micah: { wood: 0, clay: 0 },
      scott: { wood: 0, clay: 0 },
      eliya: { wood: 0, clay: 0 },
    })
    game.run()

    t.choose(game, 'Forest')              // scott
    t.choose(game, 'Clay Pit')            // eliya
    t.choose(game, 'Forest Tallyman (gap)') // dennis: 2 clay, 3 wood
    t.choose(game, 'Grain Seeds')         // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['forest-tallyman-a162'],
        wood: 3,
        clay: 2,
      },
    })
  })
})
