const t = require('../../../testutil_v2.js')

describe('Garden Designer', () => {
  // Card text: "At the start of scoring, you can place food in empty fields
  // for bonus points."
  // Note: onScoring hook is not fired by the engine.

  test('card exists and has onScoring hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['garden-designer-c099'],
      },
    })
    game.run()

    const card = game.cards.byId('garden-designer-c099')
    expect(card).toBeTruthy()
    expect(card.hasHook('onScoring')).toBe(true)
  })
})
