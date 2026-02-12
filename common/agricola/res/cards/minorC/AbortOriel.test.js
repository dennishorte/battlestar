const t = require('../../../testutil_v2.js')

describe('Abort Oriel', () => {
  test('is worth 3 VP', () => {
    const game = t.fixture({ cardSets: ['minorC', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['abort-oriel-c032'],
        clay: 2,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Abort Oriel')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1, // Meeting Place
        minorImprovements: ['abort-oriel-c032'],
      },
    })

    // Verify static VP
    const card = game.cards.byId('abort-oriel-c032')
    expect(card.definition.vps).toBe(3)
  })
})
