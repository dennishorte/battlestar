const t = require('../../../testutil_v2.js')

describe('Agricultural Fertilizers', () => {
  test('grants sow action after fencing 2+ spaces into a pasture', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        wood: 10,
        grain: 1,
        minorImprovements: ['agricultural-fertilizers-a073'],
        farmyard: {
          fields: [{ row: 2, col: 0 }],
          pastures: [{ spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] }],
        },
      },
      actionSpaces: ['Fencing'],
    })
    game.run()

    t.choose(game, 'Fencing')

    // Fence a 2-space pasture
    t.action(game, 'build-pasture', {
      spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }],
    })
    t.choose(game, 'Done building fences')

    // Agricultural Fertilizers triggers a sow action — sow grain on the field
    t.action(game, 'sow-field', { row: 2, col: 0, cropType: 'grain' })

    console.log(game.players.byName('dennis').drawFarmyard())

    t.testBoard(game, {
      dennis: {
        wood: 4,
        minorImprovements: ['agricultural-fertilizers-a073'],
        farmyard: {
          fields: [{ row: 2, col: 0, crop: 'grain', cropCount: 3 }],
          pastures: [
            { spaces: [{ row: 2, col: 3 }, { row: 2, col: 4 }] },
            { spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }] },
          ],
        },
      },
    })
  })
})
