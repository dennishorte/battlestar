const t = require('../testutil')

// "Trash a card" effect (Desert Tactics + similar) should let the player
// pick a card from hand, in play (Agent-played or Revealed), or discard
// pile — per the official Dune Imperium FAQ.

describe('trash-card effect: source zones', () => {

  function sendDennisToDesertTactics(game) {
    t.choose(game, 'Agent Turn.Diplomacy')
    t.choose(game, 'Desert Tactics')
  }

  test('offers cards from hand', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 2 },
    })
    game.run()

    sendDennisToDesertTactics(game)

    const choices = t.currentChoices(game)
    // Pass plus four remaining hand cards (Diplomacy was played as the
    // agent card and is now in the played zone, not the hand).
    expect(choices).toContain('Pass')
    expect(choices).toContain('Dagger (Hand)')
    expect(choices).toContain('Dune, The Desert Planet (Hand)')
    expect(choices).toContain('Convincing Argument (Hand)')
    expect(choices).toContain('Reconnaissance (Hand)')
  })

  test('offers the agent-played card as an "In Play" option', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 2 },
    })
    game.run()

    sendDennisToDesertTactics(game)

    const choices = t.currentChoices(game)
    expect(choices).toContain('Diplomacy (In Play)')
  })

  test('offers cards from the discard pile', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 2 },
    })
    // Move one starter card from dennis's deck to discard before the round
    // starts so there's a known, named discard entry to choose from.
    game.testSetBreakpoint('initialization-complete', (game) => {
      const deck = game.zones.byId('dennis.deck')
      const discard = game.zones.byId('dennis.discard')
      const card = deck.cardlist().find(c => c.name === 'Signet Ring')
      card.moveTo(discard)
    })
    game.run()

    sendDennisToDesertTactics(game)

    const choices = t.currentChoices(game)
    expect(choices).toContain('Signet Ring (Discard)')
  })

  test('selecting an "In Play" card moves it to the trash zone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 2 },
    })
    game.run()

    sendDennisToDesertTactics(game)
    t.choose(game, 'Diplomacy (In Play)')

    const trash = game.zones.byId('common.trash')
    const played = game.zones.byId('dennis.played')
    expect(trash.cardlist().some(c => c.name === 'Diplomacy')).toBe(true)
    expect(played.cardlist().some(c => c.name === 'Diplomacy')).toBe(false)
  })

  test('selecting a Discard card moves it to the trash zone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 2 },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      const deck = game.zones.byId('dennis.deck')
      const discard = game.zones.byId('dennis.discard')
      const card = deck.cardlist().find(c => c.name === 'Signet Ring')
      card.moveTo(discard)
    })
    game.run()

    sendDennisToDesertTactics(game)
    t.choose(game, 'Signet Ring (Discard)')

    const trash = game.zones.byId('common.trash')
    const discard = game.zones.byId('dennis.discard')
    expect(trash.cardlist().some(c => c.name === 'Signet Ring')).toBe(true)
    expect(discard.cardlist().some(c => c.name === 'Signet Ring')).toBe(false)
  })

  test('selecting a Hand card moves it to the trash zone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 2 },
    })
    game.run()

    sendDennisToDesertTactics(game)
    t.choose(game, 'Dagger (Hand)')

    const trash = game.zones.byId('common.trash')
    const hand = game.zones.byId('dennis.hand')
    expect(trash.cardlist().some(c => c.name === 'Dagger')).toBe(true)
    expect(hand.cardlist().some(c => c.name === 'Dagger')).toBe(false)
  })

  test('Pass leaves all zones unchanged', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { water: 2 },
    })
    game.run()

    const handBefore = game.zones.byId('dennis.hand').cardlist().map(c => c.id)

    sendDennisToDesertTactics(game)
    t.choose(game, 'Pass')

    const trash = game.zones.byId('common.trash')
    expect(trash.cardlist().length).toBe(0)
    // The originally-held Diplomacy is now in 'played'; the rest stay in hand.
    const handAfter = game.zones.byId('dennis.hand').cardlist().map(c => c.id)
    const expectedHand = handBefore.filter(id => !id.includes('diplomacy'))
    expect(handAfter.sort()).toEqual(expectedHand.sort())
  })
})
