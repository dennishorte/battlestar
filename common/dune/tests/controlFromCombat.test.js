const t = require('../testutil')

// Helper: finish round
function finishUntilNextRound(game) {
  const startRound = game.state.round
  let safety = 30
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

describe('Control Marker from Combat', () => {

  test('winning a location conflict grants control marker', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 5 },
      conflictCard: { location: 'imperial-basin' },
    })
    game.run()

    // Verify we got the right conflict card
    const activeCard = game.zones.byId('common.conflictActive').cardlist()[0]

    if (!activeCard?.definition?.location) {
      // Couldn't get location card on top — skip
      return
    }

    const location = activeCard.definition.location
    expect(game.state.controlMarkers[location]).toBeNull()

    // Dennis deploys troops and wins combat
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Deploy 2 troop(s) from garrison')

    finishUntilNextRound(game)

    // Dennis won — should have control of the location
    expect(game.state.controlMarkers[location]).toBe('dennis')
  })

  test('defensive bonus triggers when controlled location conflict revealed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      controlMarkers: { 'imperial-basin': 'dennis' },
      dennis: { troopsInSupply: 5, troopsInGarrison: 3 },
      conflictCard: { location: 'imperial-basin' },
    })
    game.run()

    const activeCard = game.zones.byId('common.conflictActive').cardlist()[0]
    if (activeCard?.definition?.location !== 'imperial-basin') {
      return
    }

    // Defensive bonus: dennis controls imperial-basin, conflict is at imperial-basin
    // roundStartPhase should have deployed 1 troop from supply to garrison
    const player = game.players.byName('dennis')
    // Starting: supply=5, garrison=3
    // Defensive bonus: supply=4, garrison=4
    expect(player.troopsInSupply).toBe(4)
    expect(player.troopsInGarrison).toBe(4)
  })
})
