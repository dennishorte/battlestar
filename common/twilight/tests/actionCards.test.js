const t = require('../testutil.js')
const res = require('../res/index.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

// Play through action phase with leadership+diplomacy (both use + pass)
function playThroughActionPhase(game) {
  t.choose(game, 'Strategic Action')  // dennis: leadership
  t.choose(game, 'Pass')             // micah declines secondary
  t.choose(game, 'Strategic Action')  // micah: diplomacy
  t.choose(game, 'hacan-home')
  t.choose(game, 'Pass')             // dennis declines secondary
  t.choose(game, 'Pass')
  t.choose(game, 'Pass')
}

describe('Action Cards', () => {
  describe('Card Data', () => {
    test('action card deck has multiple cards', () => {
      const deck = res.buildActionDeck()
      expect(deck.length).toBeGreaterThan(20)
    })

    test('getActionCard finds card by ID', () => {
      const card = res.getActionCard('sabotage')
      expect(card).toBeTruthy()
      expect(card.name).toBe('Sabotage')
    })

    test('sabotage has count of 4', () => {
      const deck = res.buildActionDeck()
      const sabotages = deck.filter(c => c.id === 'sabotage')
      expect(sabotages.length).toBe(4)
    })
  })

  describe('Drawing', () => {
    test('players draw 1 action card during status phase', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'diplomacy')

      playThroughActionPhase(game)

      // Status phase: redistribution
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // Dennis (Sol) has Neural Motivator: draws 2; Micah draws 1
      const dennis = game.players.byName('dennis')
      const micah = game.players.byName('micah')
      expect(dennis.actionCards.length).toBe(2)
      expect(micah.actionCards.length).toBe(1)
    })

    test('Politics primary draws 2 action cards', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'politics', 'trade')

      // Dennis uses politics
      t.choose(game, 'Strategic Action')
      t.choose(game, 'dennis')  // choose self as speaker
      t.choose(game, 'Pass')   // micah declines secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(2)
    })

    test('action card deck is initialized lazily', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.actionCardDeck).toBeNull()

      // Trigger initialization by drawing
      const dennis = game.players.byName('dennis')
      game._drawActionCards(dennis, 1)

      expect(game.state.actionCardDeck).toBeTruthy()
      expect(dennis.actionCards.length).toBe(1)
    })
  })

  describe('Secret Objectives', () => {
    test('Imperial secondary draws 1 secret objective', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'imperial')

      // Dennis (leadership=1) goes first, uses leadership
      t.choose(game, 'Strategic Action')
      t.choose(game, 'Pass')  // micah declines leadership secondary

      // Micah uses imperial
      t.choose(game, 'Strategic Action')
      // Dennis uses imperial secondary → draws secret objective
      t.choose(game, 'Use Secondary')

      const dennis = game.players.byName('dennis')
      expect(dennis.secretObjectives.length).toBe(1)
    })

    test('secret objective deck is initialized lazily', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.secretObjectiveDeck).toBeNull()

      const dennis = game.players.byName('dennis')
      game._drawSecretObjective(dennis)

      expect(game.state.secretObjectiveDeck).toBeTruthy()
      expect(dennis.secretObjectives.length).toBe(1)
    })
  })
})
