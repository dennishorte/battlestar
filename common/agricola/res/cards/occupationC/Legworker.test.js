const t = require('../../../testutil_v2.js')

describe('Legworker', () => {
  // Card text: wood when using space adjacent to own worker.
  // Board adjacency is not tracked digitally; hook is no-op.

  test('card exists and has onAction hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'] })
    t.setBoard(game, {
      round: 1,
      dennis: {
        occupations: ['legworker-c117'],
      },
    })
    game.run()

    const cardDef = game.cards.byId('legworker-c117').definition
    expect(cardDef.onAction).toBeDefined()
  })
})
