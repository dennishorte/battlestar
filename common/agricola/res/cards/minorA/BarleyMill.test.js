const t = require('../../../testutil_v2.js')
const res = require('../../index.js')

describe('Barley Mill', () => {
  test('gives food for each grain field at harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['barley-mill-a064'],
        food: 8, // enough to feed 2 workers at harvest
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 3 },
            { row: 0, col: 3, crop: 'grain', cropCount: 2 },
            { row: 0, col: 4, crop: 'vegetables', cropCount: 1 },
          ],
        },
      },
      micah: {
        food: 8, // enough to feed
      },
      round: 3, // plays round 4 (first harvest)
    })
    game.run()

    // Play through 4 actions (dennis, micah, dennis, micah)
    t.choose(game, 'Day Laborer')  // dennis: +2 food
    t.choose(game, 'Clay Pit')     // micah
    t.choose(game, 'Fishing')      // dennis
    t.choose(game, 'Forest')       // micah

    // Harvest: field phase harvests grain/veg, Barley Mill gives 2 food (2 grain fields)
    // Feeding phase: dennis pays 4 food

    t.testBoard(game, {
      dennis: {
        // food: 8 + 2 (Day Laborer) + 1 (Fishing) + 2 (Barley Mill) - 4 (feeding) = 9
        food: 9,
        grain: 2, // grain harvest: 2 grain fields each give 1 grain
        vegetables: 1, // veg harvest: 1 veg field gives 1 veg
        minorImprovements: ['barley-mill-a064'],
        farmyard: {
          fields: [
            { row: 0, col: 2, crop: 'grain', cropCount: 2 }, // harvested: 3-1=2
            { row: 0, col: 3, crop: 'grain', cropCount: 1 }, // harvested: 2-1=1
            { row: 0, col: 4 }, // harvested: 1-1=0, so empty
          ],
        },
      },
    })
  })

  test('has correct cost and vps', () => {
    const card = res.getCardById('barley-mill-a064')
    expect(card.cost).toEqual({ wood: 1, clay: 4 })
    expect(card.costAlternative).toEqual({ wood: 1, stone: 2 })
    expect(card.vps).toBe(1)
  })
})
