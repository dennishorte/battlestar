const t = require('../../../testutil_v2.js')

describe('Fire Protection Pond', () => {
  test('schedules 6 food when renovating from wood via House Redevelopment', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['House Redevelopment'],
      dennis: {
        minorImprovements: ['fire-protection-pond-a045'],
        clay: 2, // renovation cost: 1 per room (2 rooms)
        reed: 1,
      },
    })
    game.run()

    t.choose(game, 'House Redevelopment')

    t.testBoard(game, {
      dennis: {
        roomType: 'clay',
        minorImprovements: ['fire-protection-pond-a045'],
        scheduled: { food: { 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 } },
      },
    })
  })

  test('schedules 6 food when renovating from wood via free renovation', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['renovation-company-a013'],
        minorImprovements: ['fire-protection-pond-a045'],
        wood: 4, // Renovation Company cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Renovation Company')
    t.choose(game, 'Renovate from wood to clay for free')

    t.testBoard(game, {
      dennis: {
        food: 1, // +1 from Meeting Place
        clay: 3, // from Renovation Company onPlay
        roomType: 'clay',
        hand: [],
        minorImprovements: ['fire-protection-pond-a045', 'renovation-company-a013'],
        scheduled: { food: { 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1 } },
      },
    })
  })

})
