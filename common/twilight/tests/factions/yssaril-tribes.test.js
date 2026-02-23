const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Yssaril Tribes', () => {
  describe('Stall Tactics', () => {
    test('can discard action card as component action', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          actionCards: ['focused-research', 'mining-initiative'],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Yssaril) uses component action
      t.choose(game, 'Component Action')
      t.choose(game, 'stall-tactics')

      // Should be prompted to discard a card — choose focused-research
      t.choose(game, 'focused-research')

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(1)
      expect(dennis.actionCards[0].id).toBe('mining-initiative')
    })

    test('not available without action cards', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Dennis (Yssaril) has no action cards — Component Action should have no options
      t.choose(game, 'Component Action')

      // Should immediately return (no component actions)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Scheming', () => {
    test('draws 1 extra action card then discards 1', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      game.run()
      pickStrategyCards(game, 'politics', 'imperial')

      // Dennis (Yssaril, politics=3) goes first
      t.choose(game, 'Strategic Action')

      // Politics primary: choose new speaker
      t.choose(game, 'dennis')

      // After drawing 2 cards, Scheming draws 1 extra, then prompts discard
      // Dennis now has 3 cards — pick first to discard
      const cardToDiscard = game.players.byName('dennis').actionCards[0].id
      t.choose(game, cardToDiscard)

      // Re-read player after state replay
      const dennis = game.players.byName('dennis')
      // Dennis should have 2 cards (drew 3, discarded 1)
      expect(dennis.actionCards.length).toBe(2)

      // Micah gets politics secondary (draw 2 action cards)
      t.choose(game, 'Use Secondary')

      // Micah (Hacan) should have 2 cards (no scheming)
      const micah = game.players.byName('micah')
      expect(micah.actionCards.length).toBe(2)
    })
  })

  describe('Crafty', () => {
    test('Yssaril can hold more than 7 action cards', () => {
      const game = t.fixture({
        factions: ['yssaril-tribes', 'emirates-of-hacan'],
      })
      t.setBoard(game, {
        dennis: {
          actionCards: [
            'focused-research', 'mining-initiative', 'ghost-ship',
            'plague', 'uprising', 'sabotage', 'skilled-retreat',
            'direct-hit',
          ],
        },
      })
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Play through to status phase
      t.choose(game, 'Strategic Action')  // dennis: leadership
      t.choose(game, 'Pass')  // micah declines secondary
      t.choose(game, 'Strategic Action')  // micah: diplomacy
      t.choose(game, 'hacan-home')
      t.choose(game, 'Pass')  // dennis declines secondary
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase — both draw 1 card
      // Dennis (Yssaril) scheming triggers: draws extra, discards 1
      // Pick any card to discard for scheming
      const dennisCards = game.players.byName('dennis').actionCards
      t.choose(game, dennisCards[0].id)

      // Dennis has 8+ cards but Crafty means no hand limit enforcement
      // Status phase continues (no discard prompt for Dennis)
      // Micah has ≤7 cards so no discard prompt either
      t.choose(game, 'Done')  // dennis token redistribution
      t.choose(game, 'Done')  // micah token redistribution

      // Dennis should still have 8+ cards (no forced discard)
      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBeGreaterThanOrEqual(8)
    })
  })
})
