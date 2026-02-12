const t = require('../../../testutil_v2.js')

describe('Bartering Hut', () => {
  test('buy 1 sheep for 2 building resources', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bartering-hut-e009'],
        wood: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bartering Hut')
    t.choose(game, 'Spend 2 resources for 1 sheep')
    // wood=0 now, loop auto-exits (total < 2)

    t.testBoard(game, {
      dennis: {
        food: 1,  // Meeting Place
        pet: 'sheep',
        animals: { sheep: 1 },
        minorImprovements: ['bartering-hut-e009'],
      },
    })
  })

  test('buy 2 animals in same play', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['bartering-hut-e009'],
        wood: 3,
        clay: 2,
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }] }],
        },
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Bartering Hut')
    t.choose(game, 'Spend 2 resources for 1 sheep')
    t.choose(game, 'Spend 3 resources for 1 boar')

    t.testBoard(game, {
      dennis: {
        food: 1,  // Meeting Place
        // wood: 3-2-1=0, clay: 2-2=0 (deducted from most abundant first)
        pet: 'boar',  // pasture has sheep, so boar goes to pet slot
        animals: { sheep: 1, boar: 1 },
        minorImprovements: ['bartering-hut-e009'],
        farmyard: {
          pastures: [{ spaces: [{ row: 1, col: 3 }, { row: 1, col: 4 }], sheep: 1 }],
        },
      },
    })
  })
})
