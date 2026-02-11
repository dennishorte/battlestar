const t = require('../../../testutil_v2.js')

describe('Hawktower', () => {
  test('schedules free stone room for round 12', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['hawktower-b014'],
        clay: 2, // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Hawktower')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        minorImprovements: ['hawktower-b014'],
        scheduled: { stoneRooms: [12] },
      },
    })
  })

  test('round 12 with stone house → room is built', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        roomType: 'stone',
        minorImprovements: ['hawktower-b014'],
        scheduled: { stoneRooms: [12] },
      },
    })
    game.run()

    // Hawktower offers to build free stone room (at round start, before actions)
    t.choose(game, 'Build free stone room (Hawktower)')
    // Choose location - adjacent to existing rooms at (0,0) and (1,0)
    t.choose(game, '0,1')

    // First action choice for the round
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2, // from Day Laborer
        roomType: 'stone',
        minorImprovements: ['hawktower-b014'],
        farmyard: {
          rooms: [
            { row: 0, col: 0 }, { row: 1, col: 0 },
            { row: 0, col: 1 },
          ],
        },
      },
    })
  })

  test('round 12 without stone house → room is discarded', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 12,
      firstPlayer: 'dennis',
      dennis: {
        roomType: 'wood',
        minorImprovements: ['hawktower-b014'],
        scheduled: { stoneRooms: [12] },
      },
    })
    game.run()

    // Room should be discarded automatically (not in stone house)
    t.choose(game, 'Day Laborer')

    t.testBoard(game, {
      dennis: {
        food: 2,
        roomType: 'wood',
        minorImprovements: ['hawktower-b014'],
      },
    })
  })
})
