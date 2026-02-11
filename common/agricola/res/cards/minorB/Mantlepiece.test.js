const t = require('../../../testutil_v2.js')

describe('Mantlepiece', () => {
  test('gives bonus points equal to rounds left when played', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['mantlepiece-b033'],
        roomType: 'clay',
        stone: 1, // card cost
      },
    })
    game.run()

    // Dennis plays Mantlepiece via Meeting Place
    // Round 1: 14 - 1 = 13 rounds left → 13 bonus points
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Mantlepiece')

    t.testBoard(game, {
      dennis: {
        food: 1, // from Meeting Place
        bonusPoints: 13, // 14 - 1 = 13 rounds left
        roomType: 'clay',
        minorImprovements: ['mantlepiece-b033'],
      },
    })
  })
})
