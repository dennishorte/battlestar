const t = require('../../../testutil_v2.js')

describe('Heirloom', () => {
  test('is worth 2 VP', () => {
    const game = t.fixture({ cardSets: ['minorE', 'minorImprovementA', 'test'] })
    t.setBoard(game, {
      round: 5,
      firstPlayer: 'dennis',
      dennis: {
        hand: ['heirloom-e029'],
      },
    })
    game.run()

    t.choose(game, 'Meeting Place')
    t.choose(game, 'Minor Improvement.Heirloom')

    t.testBoard(game, {
      currentPlayer: 'micah',
      dennis: {
        food: 1,
        minorImprovements: ['heirloom-e029'],
      },
    })

    const card = game.cards.byId('heirloom-e029')
    expect(card.definition.vps).toBe(2)
  })
})
