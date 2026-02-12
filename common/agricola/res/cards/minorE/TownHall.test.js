const t = require('../../../testutil_v2.js')

describe('Town Hall', () => {
  test('gives 1 food in feeding phase with clay house', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['town-hall-e048'],
        roomType: 'clay',
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Harvest: TownHall +1 food (clay), Feeding -4 food
    // 10 + 2(DL) + 1(TownHall) - 4(feed) = 9
    t.testBoard(game, {
      dennis: {
        food: 9,
        grain: 1,
        roomType: 'clay',
        minorImprovements: ['town-hall-e048'],
      },
    })
  })

  test('gives 2 food in feeding phase with stone house', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 4,
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['town-hall-e048'],
        roomType: 'stone',
        food: 10,
      },
      micah: { food: 10 },
    })
    game.run()

    t.choose(game, 'Day Laborer') // dennis
    t.choose(game, 'Forest')      // micah
    t.choose(game, 'Grain Seeds') // dennis
    t.choose(game, 'Clay Pit')    // micah

    // Harvest: TownHall +2 food (stone), Feeding -4 food
    // 10 + 2(DL) + 2(TownHall) - 4(feed) = 10
    t.testBoard(game, {
      dennis: {
        food: 10,
        grain: 1,
        roomType: 'stone',
        minorImprovements: ['town-hall-e048'],
      },
    })
  })
})
