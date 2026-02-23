const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Xxcha Kingdom', () => {
  describe('Peace Accords', () => {
    test('gains unoccupied adjacent planet after diplomacy', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      game.run()
      pickStrategyCards(game, 'diplomacy', 'leadership')

      // Micah (leadership=1) goes first
      t.choose(game, 'Strategic Action')  // micah: leadership
      t.choose(game, 'Pass')  // dennis declines secondary

      // Dennis (Xxcha, diplomacy=2) uses diplomacy
      t.choose(game, 'Strategic Action')
      t.choose(game, 'xxcha-home')  // Choose home system for Diplomacy

      // Peace Accords: Xxcha can gain unoccupied planet adjacent to controlled planets
      const choices = t.currentChoices(game)
      expect(choices).toContain('Pass')
      expect(choices.length).toBeGreaterThan(1)

      // Choose first non-Pass option
      const planetChoice = choices.find(c => c !== 'Pass')
      t.choose(game, planetChoice)

      // Micah gets diplomacy secondary prompt
      t.choose(game, 'Pass')

      // The chosen planet should now be controlled by dennis
      expect(game.state.planets[planetChoice].controller).toBe('dennis')
    })
  })

  describe('Quash', () => {
    test('spends strategy token to discard and replace agenda', () => {
      const game = t.fixture({ factions: ['xxcha-kingdom', 'emirates-of-hacan'] })
      t.setBoard(game, {
        custodiansRemoved: true,
        agendaDeck: ['mutiny', 'anti-intellectual-revolution', 'incentive-program'],
      })
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
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Agenda phase — first agenda revealed: "mutiny"
      // Xxcha (dennis) gets Quash prompt
      t.choose(game, 'Quash')

      // Strategy token spent (started with 2, spent 1)
      const dennis = game.players.byName('dennis')
      expect(dennis.commandTokens.strategy).toBe(1)
    })
  })
})
