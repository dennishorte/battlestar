const t = require('../testutil')

describe('Harvest and Bonus Spice', () => {

  test('bonus spice collected when harvesting at maker space', () => {
    const game = t.fixture()
    t.setBoard(game, {
      bonusSpice: { 'imperial-basin': 3 },
      dennis: { spice: 0 },
    })
    game.run()

    // Dennis reveals first (can't go to yellow space with these hand cards easily)
    // Actually, dennis has no yellow card in hand with this seed.
    // Let's skip dennis and have micah harvest.
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // Micah has Dune, The Desert Planet (yellow) → Imperial Basin
    t.choose(game, 'Agent Turn.Dune, The Desert Planet')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Deploy 0 troop(s) from garrison')

    // Imperial Basin harvests 1 base spice + 3 bonus = 4
    const micah = game.players.byName('micah')
    expect(micah.spice).toBeGreaterThanOrEqual(4)

    // Bonus spice should be cleared after harvest
    expect(game.state.bonusSpice['imperial-basin']).toBe(0)
  })

  test('maker spaces accumulate correctly over two no-agent rounds', () => {
    const game = t.fixture()
    game.run()

    // Round 1: both reveal immediately — no agents on any maker spaces
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass')

    // After round 1 makers: +1 on all three
    // (Round 2 has already started by now)
    expect(game.state.bonusSpice['deep-desert']).toBe(1)
    expect(game.state.bonusSpice['hagga-basin']).toBe(1)
    expect(game.state.bonusSpice['imperial-basin']).toBe(1)
  })
})
