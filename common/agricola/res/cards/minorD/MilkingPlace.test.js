const t = require('../../../testutil_v2.js')

describe('Milking Place', () => {
  test('gives 1 food in feeding phase of harvest', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['milking-place-d012'],
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    // 4 actions to complete round 4
    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Harvest: MilkingPlace +1 food, Feeding -4 food
    // 10 + 2(DL) + 1(MilkingPlace) - 4(feed) = 9
    t.testBoard(game, {
      dennis: {
        food: 9,
        grain: 1,
        minorImprovements: ['milking-place-d012'],
      },
    })
  })
})
