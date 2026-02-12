const t = require('../../../testutil_v2.js')

describe('Automatic Water Trough', () => {
  test('buy 1 sheep for free when played', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['automatic-water-trough-c009'],
        wood: 1,  // card cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Automatic Water Trough')
    t.choose(game, 'Buy 1 sheep (free)')

    t.testBoard(game, {
      dennis: {
        food: 1,  // Meeting Place gives 1 food
        pet: 'sheep',
        animals: { sheep: 1 },
        minorImprovements: ['automatic-water-trough-c009'],
      },
    })
  })

  test('buy 1 cattle for 2 food when played', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 2,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['automatic-water-trough-c009'],
        wood: 1,  // card cost
        food: 2,  // cattle cost
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Automatic Water Trough')
    t.choose(game, 'Buy 1 cattle for 2 food')

    t.testBoard(game, {
      dennis: {
        food: 1,  // 2 + 1 (Meeting Place) - 2 (cattle) = 1
        pet: 'cattle',
        animals: { cattle: 1 },
        minorImprovements: ['automatic-water-trough-c009'],
      },
    })
  })
})
