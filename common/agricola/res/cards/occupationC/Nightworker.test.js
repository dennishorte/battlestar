const t = require('../../../testutil_v2.js')

describe('Nightworker', () => {
  // Card text: "Before the start of each work phase, you can place a person
  // on an accumulation space of a building resource not in your supply."
  // Note: onBeforeWorkPhase hook is not fired by the engine.

  test('card exists and has onBeforeWorkPhase hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['nightworker-c125'],
      },
    })
    game.run()

    const card = game.cards.byId('nightworker-c125')
    expect(card).toBeTruthy()
    expect(card.hasHook('onBeforeWorkPhase')).toBe(true)
  })
})
