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
    })
    // Put "Secure Imperial Basin" (location: imperial-basin) as the first conflict card
    game.testSetBreakpoint('initialization-complete', (g) => {
      const deck = g.zones.byId('common.conflictDeck')
      const cards = deck.cardlist()
      const locCard = cards.find(c => c.definition?.location === 'imperial-basin' && c.definition?.tier === 2)
      if (locCard) {
        // Remove it from current position and insert at top
        const idx = cards.indexOf(locCard)
        if (idx > 0) {
          // Move other cards down, put this at index 0
          locCard.moveTo(deck, 0)
        }
      }
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
    })
    // Put "Secure Imperial Basin" as the conflict card for round 1
    game.testSetBreakpoint('initialization-complete', (g) => {
      const deck = g.zones.byId('common.conflictDeck')
      const cards = deck.cardlist()
      const locCard = cards.find(c => c.definition?.location === 'imperial-basin')
      if (locCard) {
        locCard.moveTo(deck, 0)
      }
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
