const t = require('../../../testutil_v2.js')

describe('Carriage Trip', () => {
  test('places extra person immediately on play', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 1,
      dennis: {
        hand: ['carriage-trip-c003'],
        food: 1,  // Meeting Place gives 1 food, card costs 0
      },
    })
    game.run()

    // Take Meeting Place → play Carriage Trip → bonus turn → take Forest
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Carriage Trip')
    // Bonus turn: dennis places second worker immediately
    t.choose(game, 'Forest')

    // micah takes 2 turns
    t.choose(game, 'Day Laborer')   // micah
    t.choose(game, 'Fishing')       // micah (dennis already used both workers)

    t.testBoard(game, {
      dennis: {
        wood: 3,    // 3 from Forest
        food: 2,    // 0 + 1 (Meeting Place) + 1 (initial)
        minorImprovements: ['carriage-trip-c003'],
      },
    })
  })
})
