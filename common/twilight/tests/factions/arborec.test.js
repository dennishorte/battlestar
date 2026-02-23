const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Arborec', () => {
  describe('Mitosis', () => {
    test('places 1 infantry on controlled planet during status phase', () => {
      const game = t.fixture({ factions: ['arborec', 'emirates-of-hacan'] })
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

      // Status phase — Arborec mitosis: choose planet
      t.choose(game, 'nestphar')

      // Token redistribution
      t.choose(game, 'Done')  // dennis
      t.choose(game, 'Done')  // micah

      // Arborec should have 1 more infantry on nestphar
      // Started with 4 infantry + 1 mitosis = 5
      const nestphar = game.state.units['arborec-home'].planets['nestphar']
        .filter(u => u.owner === 'dennis' && u.type === 'infantry')
      expect(nestphar.length).toBe(5)
    })
  })
})
