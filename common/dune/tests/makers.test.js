const t = require('../testutil')

// Helper: both players reveal and pass to end player turns phase
function revealAndPass(game) {
  t.choose(game, 'Reveal Turn')
  while (game.waiting) {
    const title = game.waiting.selectors[0]?.title || ''
    if (title.includes('Acquire') || title.includes('Plot')) {
      t.choose(game, 'Pass')
    }
    else {
      break
    }
  }
}

describe('Makers Phase', () => {

  test('unoccupied maker spaces accumulate spice', () => {
    const game = t.fixture()
    game.run()

    // Both players reveal immediately — no agents placed on maker spaces
    revealAndPass(game) // dennis
    revealAndPass(game) // micah
    // After combat (no combatants), makers phase runs

    // All three maker spaces should have +1 bonus spice
    t.testBoard(game, { round: 2 })
    expect(game.state.bonusSpice['deep-desert']).toBe(1)
    expect(game.state.bonusSpice['hagga-basin']).toBe(1)
    expect(game.state.bonusSpice['imperial-basin']).toBe(1)
  })

  test('bonus spice accumulates over multiple rounds', () => {
    const game = t.fixture()
    game.run()

    // Round 1: both reveal
    revealAndPass(game)
    revealAndPass(game)

    // Round 2: both reveal again
    revealAndPass(game)
    revealAndPass(game)

    // Two rounds of accumulation
    t.testBoard(game, { round: 3 })
    expect(game.state.bonusSpice['deep-desert']).toBe(2)
    expect(game.state.bonusSpice['hagga-basin']).toBe(2)
    expect(game.state.bonusSpice['imperial-basin']).toBe(2)
  })
})
