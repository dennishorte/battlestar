const t = require('../testutil.js')
const res = require('../res/index.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

// Play through action phase with leadership+diplomacy (both use + pass)
function playThroughActionPhase(game) {
  t.choose(game, 'Strategic Action.leadership')  // dennis: leadership
  t.choose(game, 'Done')             // dennis: allocate 3 tokens
  t.choose(game, 'Strategic Action.diplomacy')  // micah: diplomacy
  t.choose(game, 'hacan-home')
  // dennis: diplomacy secondary auto-skipped (no exhausted planets)
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
      t.choose(game, 'Strategic Action.politics')
      // Speaker choice auto-resolves to micah (dennis is current speaker)
      // Agenda deck peek
      t.choose(game, t.currentChoices(game)[0])
      t.choose(game, 'Top of deck')
      t.choose(game, 'Top of deck')
      t.choose(game, 'Pass')   // micah declines secondary

      const dennis = game.players.byName('dennis')
      expect(dennis.actionCards.length).toBe(2)
    })

    test('action card deck is initialized lazily', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.actionCardDeck).toBeNull()

      // Play through action phase to reach status phase where cards are drawn
      pickStrategyCards(game, 'leadership', 'diplomacy')
      playThroughActionPhase(game)

      // Status phase: redistribution
      t.choose(game, 'Done')
      t.choose(game, 'Done')

      // Drawing action cards during status phase initializes the deck
      expect(game.state.actionCardDeck).toBeTruthy()
    })
  })

  describe('Secret Objectives', () => {
    test('Imperial secondary draws 1 secret objective', () => {
      const game = t.fixture()
      game.run()
      pickStrategyCards(game, 'leadership', 'imperial')

      // Dennis (leadership=1) goes first, uses leadership
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')             // dennis: allocate 3 tokens

      // Micah uses imperial
      t.choose(game, 'Strategic Action.imperial')
      // Dennis uses imperial secondary → draws secret objective
      t.choose(game, 'Use Secondary')

      const dennis = game.players.byName('dennis')
      expect(dennis.secretObjectives.length).toBe(1)
    })

    test('secret objective deck is initialized lazily', () => {
      const game = t.fixture()
      game.run()

      expect(game.state.secretObjectiveDeck).toBeNull()

      // Imperial secondary draws a secret objective
      pickStrategyCards(game, 'leadership', 'imperial')

      // Dennis (leadership=1) goes first, uses leadership
      t.choose(game, 'Strategic Action.leadership')
      t.choose(game, 'Done')             // dennis: allocate 3 tokens

      // Micah uses imperial
      t.choose(game, 'Strategic Action.imperial')
      // Dennis uses imperial secondary → draws secret objective → inits deck
      t.choose(game, 'Use Secondary')

      expect(game.state.secretObjectiveDeck).toBeTruthy()
      const dennis = game.players.byName('dennis')
      expect(dennis.secretObjectives.length).toBe(1)
    })
  })
})
