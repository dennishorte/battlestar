const t = require('../../../testutil_v2.js')

describe('Autumn Mother', () => {
  // Card text: "Immediately before each harvest, if you have room in your house,
  // you can take a 'Family Growth' action for 3 food."

  test('card exists and has onBeforeHarvest hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['autumn-mother-c092'],
      },
    })
    game.run()

    const card = game.cards.byId('autumn-mother-c092')
    expect(card).toBeTruthy()
    expect(card.hasHook('onBeforeHarvest')).toBe(true)
  })
})
