const t = require('../testutil.js')

// Helper: play through strategy phase with specific cards
function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Action Phase', () => {
  describe('Turn Order', () => {
    test('player with lowest strategy card number goes first', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'imperial', 'leadership')

      // micah has leadership(1), dennis has imperial(8)
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })

    test('turns rotate through active players', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // dennis first (leadership=1)
      expect(game.waiting.selectors[0].actor).toBe('dennis')
      t.choose(game, 'Tactical Action')
      t.choose(game, 'Done')

      // micah next
      expect(game.waiting.selectors[0].actor).toBe('micah')
      t.choose(game, 'Tactical Action')
      t.choose(game, 'Done')

      // back to dennis
      expect(game.waiting.selectors[0].actor).toBe('dennis')
    })

    test('skip passed players in turn rotation', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // dennis: use strategy card (leadership — gains 3 tokens, allocate)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      // micah: use strategy card (diplomacy — choose system)
      t.choose(game, 'Strategic Action.diplomacy')
      t.choose(game, 'hacan-home')  // micah picks system for diplomacy
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      // dennis: pass
      t.choose(game, 'Pass')

      // only micah left
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })
  })

  describe('Action Types', () => {
    test('player can take tactical action', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const choices = t.currentChoices(game)
      expect(choices).toContain('Tactical Action')
    })

    test('player can take strategic action', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const choices = t.currentChoices(game)
      expect(choices).toContain('Strategic Action')
    })

    test('player can take component action', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      const choices = t.currentChoices(game)
      expect(choices).toContain('Component Action')
    })

    test('player can pass after using strategy card', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // dennis uses strategy card (leadership — gains 3 tokens, allocate)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      // micah's turn (skip)
      t.choose(game, 'Tactical Action')
      t.choose(game, 'Done')

      // dennis should now have Pass available
      const choices = t.currentChoices(game)
      expect(choices).toContain('Pass')
    })

    test('player cannot pass until strategy card is used', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // dennis has not used strategy card yet
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Pass')
    })
  })

  describe('Passing', () => {
    test('player who passes takes no more turns this phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Both use strategy cards
      t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
      t.choose(game, 'hacan-home')        // micah picks system
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      // dennis passes
      t.choose(game, 'Pass')

      // micah is the only active player, all subsequent turns are micah
      expect(game.waiting.selectors[0].actor).toBe('micah')
      t.choose(game, 'Tactical Action')
      t.choose(game, 'Done')
      expect(game.waiting.selectors[0].actor).toBe('micah')
    })

    test('action phase ends when all players have passed', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Both use strategy cards then pass
      t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
      t.choose(game, 'hacan-home')        // micah picks system
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')              // dennis
      t.choose(game, 'Pass')              // micah

      // Should now be in status phase
      expect(game.state.phase).toBe('status')
    })

    test('passed state resets for next round', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // Both use strategy cards then pass (ends action phase)
      t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
      t.choose(game, 'Done')  // allocate tokens
      t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
      t.choose(game, 'hacan-home')        // micah picks system
      // dennis: diplomacy secondary auto-skipped (no exhausted planets)
      t.choose(game, 'Pass')
      t.choose(game, 'Pass')

      // Status phase: redistribute tokens for each player
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Round 2 strategy phase
      expect(game.state.round).toBe(2)
      expect(game.state.phase).toBe('strategy')
      expect(game.waiting.selectors[0].title).toBe('Choose Strategy Card')
    })
  })

  describe('Strategic Action', () => {
    test('using strategy card marks it as used', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      t.choose(game, 'Strategic Action.leadership')  // dennis uses leadership
      t.choose(game, 'Done')  // allocate tokens

      expect(game.players.byName('dennis').hasUsedStrategyCard()).toBe(true)
    })

    test('strategic action not available after card is used', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      // dennis uses strategy card (leadership)
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')  // allocate tokens
      // micah's turn (skip)
      t.choose(game, 'Tactical Action')
      t.choose(game, 'Done')

      // Back to dennis — Strategic Action should not be available
      const choices = t.currentChoices(game)
      expect(choices).not.toContain('Strategic Action')
    })

    test('other players can resolve secondary', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'construction', 'imperial')

      // Dennis uses construction
      t.choose(game, 'Strategic Action.construction')
      t.choose(game, 'Federation of Sol:Jord.pds')
      t.choose(game, 'Federation of Sol:Jord')
      // Micah uses construction secondary (costs 1 strategy token)
      t.choose(game, 'Use Secondary')

      const micah = game.players.byName('micah')
      expect(micah.commandTokens.strategy).toBe(1)
    })

    test('secondary costs strategy command token', () => {
      const game = t.fixture()
      t.setBoard(game, {
        micah: {
          commandTokens: { tactics: 3, strategy: 0, fleet: 3 },
        },
      })
      game.run()
      pickStrategyCards(game, 'construction', 'imperial')

      // Dennis uses construction
      t.choose(game, 'Strategic Action.construction')
      t.choose(game, 'Federation of Sol:Jord.pds')
      t.choose(game, 'Federation of Sol:Jord')
      // Micah has 0 strategy tokens — should NOT be prompted for secondary

      // Should go straight to micah's turn without secondary prompt
      expect(game.waiting.selectors[0].actor).toBe('micah')
      expect(game.waiting.selectors[0].title).toBe('Choose Action')
    })
  })
})
