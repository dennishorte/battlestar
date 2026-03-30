const t = require('../testutil')

function completeRound(game) {
  const startRound = game.state.round
  let safety = 50
  while (game.waiting && !game.gameOver && game.state.round === startRound && safety-- > 0) {
    const choices = t.currentChoices(game)
    if (choices.includes('Reveal Turn')) {
      t.choose(game, 'Reveal Turn')
    }
    else if (choices.includes('Pass')) {
      t.choose(game, 'Pass')
    }
    else {
      t.choose(game, choices[0])
    }
  }
}

describe('Endgame Tiebreakers', () => {

  test('tiebreaker: solari breaks VP+spice tie', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, spice: 5, solari: 2, water: 0 },
      micah: { vp: 10, spice: 5, solari: 8, water: 0 },
    })
    game.run()

    completeRound(game)

    expect(game.gameOver).toBe(true)
    expect(game.gameOverData.player).toBe('micah')
  })

  test('tiebreaker: water breaks VP+spice+solari tie', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, spice: 5, solari: 5, water: 3 },
      micah: { vp: 10, spice: 5, solari: 5, water: 1 },
    })
    game.run()

    completeRound(game)

    expect(game.gameOver).toBe(true)
    expect(game.gameOverData.player).toBe('dennis')
  })

  test('tiebreaker: garrisoned troops breaks full resource tie', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { vp: 10, spice: 5, solari: 5, water: 2, troopsInGarrison: 1 },
      micah: { vp: 10, spice: 5, solari: 5, water: 2, troopsInGarrison: 4 },
    })
    game.run()

    completeRound(game)

    expect(game.gameOver).toBe(true)
    expect(game.gameOverData.player).toBe('micah')
  })
})
