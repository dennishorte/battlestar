const t = require('../../../testutil_v2.js')

describe('Sculpture', () => {
  test('is worth 2 VP', () => {
    const game = t.fixture({ cardSets: ['minorD', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 1,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['sculpture-d037'],
        stone: 1,
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Sculpture')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        minorImprovements: ['sculpture-d037'],
      },
    })

    const card = game.cards.byId('sculpture-d037')
    expect(card.definition.vps).toBe(2)
  })
})
