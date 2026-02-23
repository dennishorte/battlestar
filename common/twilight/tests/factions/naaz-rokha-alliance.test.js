const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Naaz-Rokha Alliance', () => {
  test('purges fragments for command token', () => {
    const game = t.fixture({ factions: ['naaz-rokha-alliance', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: { relicFragments: ['cultural', 'hazardous'] },
    })
    game.run()

    pickStrategyCards(game, 'leadership', 'diplomacy')

    // Dennis uses Component Action → Fabrication
    t.choose(game, 'Component Action')
    t.choose(game, 'fabrication')

    // "Purge 1 fragment for command token" auto-responds (only option since no pair)
    // Then choose which fragment type to purge
    t.choose(game, 'cultural')

    const dennis = game.players.byName('dennis')
    expect(dennis.relicFragments.length).toBe(1)
    expect(dennis.relicFragments[0]).toBe('hazardous')
    // Gained 1 command token (started with 3)
    expect(dennis.commandTokens.tactics).toBe(4)
  })
})
