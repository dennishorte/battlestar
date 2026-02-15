const t = require('../../../testutil_v2.js')

describe('Stone Importer', () => {
  // Card text: "In the breeding phase of each harvest, you can buy 2 stone
  // for varying food costs."

  test('card exists and has onBreedingPhaseEnd hook', () => {
    const game = t.fixture({ cardSets: ['occupationC', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['stone-importer-c124'],
      },
    })
    game.run()

    const card = game.cards.byId('stone-importer-c124')
    expect(card).toBeTruthy()
    expect(card.hasHook('onBreedingPhaseEnd')).toBe(true)
  })
})
