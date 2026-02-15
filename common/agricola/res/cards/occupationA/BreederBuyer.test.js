const t = require('../../../testutil_v2.js')

describe('Breeder Buyer', () => {
  // Card is 4+ players. onBuildRoomAndStable: build room + stable same turn → 1 sheep/boar/cattle by room type.

  test('onBuildRoomAndStable gives 1 sheep when building wood room and stable same turn', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 4 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['breeder-buyer-a167'],
        roomType: 'wood',
        wood: 7,
        reed: 2,
        food: 5,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
      micah: { food: 5 },
      scott: { food: 5 },
      eliya: { food: 5 },
    })
    game.run()

    t.choose(game, 'Farm Expansion')
    t.choose(game, 'Build Room')
    t.choose(game, '0,1')
    t.choose(game, 'Build Stable')
    t.choose(game, '1,1')
    // Build loop exits automatically when player can't afford more; next prompt is micah's action
    t.choose(game, 'Forest')

    t.testBoard(game, {
      dennis: {
        occupations: ['breeder-buyer-a167'],
        wood: 0,
        reed: 0,
        food: 5,
        animals: { sheep: 1 },
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }],
          pastures: [{ spaces: [{ row: 2, col: 0 }], sheep: 1 }],
          stables: [{ row: 1, col: 1 }],
        },
      },
    })
  })
})
