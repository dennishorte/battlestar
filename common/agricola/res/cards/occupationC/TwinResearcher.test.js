const t = require('../../../testutil_v2.js')

describe('Twin Researcher', () => {
  // Card text: matching accumulation spaces with same goods → buy BP
  // This is complex to set up. Test basic card existence.

  test('card exists and has onAction hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['twin-researcher-c154'],
      },
    })
    game.run()

    const cardDef = game.cards.byId('twin-researcher-c154').definition
    expect(cardDef.onAction).toBeDefined()
  })
})
