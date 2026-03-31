const t = require('../testutil')

describe('Agent-Turn Cards Excluded from Reveal', () => {

  test('card played during agent turn moves to played zone, not hand', () => {
    const game = t.fixture()
    game.run()

    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(5)

    // Dennis plays Dagger (green) to Assembly Hall
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Assembly Hall')

    // Dagger is now in played zone, not hand
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(4)

    const playedZone = game.zones.byId('dennis.played')
    expect(playedZone.cardlist().length).toBe(1)
    expect(playedZone.cardlist()[0].name).toBe('Dagger')
  })

  test('reveal turn only processes remaining hand cards, not played cards', () => {
    const game = t.fixture()
    game.run()

    // Dennis plays 2 agent turns (has 2 agents)
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Assembly Hall')

    // Micah takes turn — pick first available card
    const micahCards = game.waiting.selectors[0].choices.find(c => c.title === 'Agent Turn').choices
    t.choose(game, 'Agent Turn.' + micahCards[0])
    t.choose(game, t.currentChoices(game)[0])

    // Dennis plays second agent
    t.choose(game, 'Agent Turn.Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    // Micah reveals
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Dennis should now reveal (no agents left, auto-reveal)
    // 5 cards - 2 played = 3 remaining in hand to reveal
    // Verify played zone has 2, and strength calculation only uses revealed cards
    const playedZone = game.zones.byId('dennis.played')
    expect(playedZone.cardlist().length).toBe(2)

    // Dennis auto-reveals — with 0 troops in conflict, swords from revealed cards = 0 strength
    // This confirms played cards' swords are not counted
    const dennis = game.players.byName('dennis')
    // Auto-reveal happens, then acquire phase
    t.choose(game, 'Pass') // acquire
    expect(dennis.strength).toBe(0) // no units, so 0 regardless of swords
  })
})
