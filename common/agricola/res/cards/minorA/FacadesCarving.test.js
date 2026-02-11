const t = require('../../../testutil_v2.js')

describe('Facades Carving', () => {
  test('exchanges food for bonus points via Meeting Place after first harvest', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 6, // after first harvest (round 4), so 1 completed harvest
      dennis: {
        hand: ['facades-carving-a036'],
        food: 5, // enough for card + exchange
        wood: 6, // prereq: woodGteRound (wood >= round = 6)
        clay: 2, // card cost
        reed: 1, // card cost
      },
    })
    game.run()

    // Dennis takes Meeting Place, plays Facades Carving
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Facades Carving')
    // onPlay fires: 1 completed harvest → can exchange up to 1 food for 1 bonus point
    t.choose(game, 'Exchange 1 food for 1 bonus point')

    t.testBoard(game, {
      dennis: {
        food: 5, // 5 + 1 Meeting Place - 1 exchange
        wood: 6,
        hand: [],
        minorImprovements: ['facades-carving-a036'],
        bonusPoints: 1,
      },
    })
  })

  test('no offer when no harvests completed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      firstPlayer: 'dennis',
      round: 2, // no harvests completed
      dennis: {
        hand: ['facades-carving-a036'],
        food: 5,
        wood: 2, // prereq: woodGteRound (wood >= round = 2)
        clay: 2,
        reed: 1,
      },
    })
    game.run()

    // Dennis takes Meeting Place, plays Facades Carving
    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Facades Carving')
    // onPlay fires but no harvests completed → no offer, turn ends

    t.testBoard(game, {
      dennis: {
        food: 6, // 5 + 1 MP
        wood: 2,
        hand: [],
        minorImprovements: ['facades-carving-a036'],
      },
    })
  })
})
