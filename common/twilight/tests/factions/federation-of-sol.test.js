const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Federation of Sol', () => {
  describe('Orbital Drop', () => {
    test('places 2 infantry on a controlled planet', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis uses Component Action → Orbital Drop
      // Only 1 controlled planet (jord) so planet choice auto-resolves
      t.choose(game, 'Component Action')
      t.choose(game, 'orbital-drop')

      // Re-read state after action (deterministic replay rebuilds state)
      const jord = game.state.units['sol-home'].planets['jord']
      const infantryCount = jord.filter(u => u.owner === 'dennis' && u.type === 'infantry').length
      // Sol starts with 5 infantry + 2 from orbital drop = 7
      expect(infantryCount).toBe(7)
    })

    test('costs 1 tactics command token', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Only 1 controlled planet so auto-resolves
      t.choose(game, 'Component Action')
      t.choose(game, 'orbital-drop')

      // Started with 3 tactics, spent 1 = 2
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.tactics).toBe(2)
    })

    test('not available to non-Sol factions', () => {
      const game = t.fixture({ factions: ['emirates-of-hacan', 'federation-of-sol'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis is Hacan here — Component Action should have no component actions
      // The choose will log "No component actions available" and return
      t.choose(game, 'Component Action')

      // Should immediately return to dennis's turn
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Versatile', () => {
    test('gains 1 extra command token in status phase', () => {
      const game = t.fixture({ factions: ['federation-of-sol', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through action phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase
      t.choose(game, 'Done')  // dennis gets 3 (2+1 Versatile)
      t.choose(game, 'Done')  // micah gets 2

      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')

      // Dennis: 3 (start) + 3 (leadership) + 3 (status: 2+1 Versatile) = 9
      expect(dennis.commandTokens.tactics).toBe(9)
      // Micah: 3 (start) + 2 (status) = 5
      expect(micah.commandTokens.tactics).toBe(5)
    })
  })
})
