const t = require('../testutil')

describe('Reveal Turns', () => {

  test('reveal accumulates persuasion from revealed cards', () => {
    const game = t.fixture()
    game.run()

    // Dennis hand: Dagger(0), CA(2), Diplomacy(1), CA(2), Recon(1) = 6 persuasion
    t.choose(game, 'Reveal Turn')

    const player = game.players.byName('dennis')
    expect(player.getCounter('persuasion')).toBe(6)
  })

  test('reveal accumulates swords from revealed cards', () => {
    const game = t.fixture()
    game.run()

    // Dennis has 1 Dagger (1 sword) in hand
    // No troops in conflict, so strength stays 0
    t.choose(game, 'Reveal Turn')

    // Swords contribute to strength only if units in conflict
    // With no troops deployed, strength should be 0
    const player = game.players.byName('dennis')
    expect(player.strength).toBe(0)
  })

  test('swords add to strength when units are in conflict', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { troopsInGarrison: 3 },
    })
    game.run()

    // Dennis: Agent Turn with Reconnaissance to Arrakeen (combat space)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Reconnaissance')
    t.choose(game, 'Arrakeen')
    // Deploy 1 troop from garrison
    t.choose(game, 'Deploy 1 troop(s) from garrison')

    // Micah's turn — reveal immediately
    t.choose(game, 'Reveal Turn')
    t.choose(game, 'Pass') // micah acquire

    // Dennis's second turn — reveal with remaining 4 cards
    // Remaining hand: Dagger(1 sword), CA, Diplomacy, CA
    t.choose(game, 'Reveal Turn')

    // Strength = 1 deployed troop × 2 + 1 sword × 1 = 3
    const player = game.players.byName('dennis')
    expect(game.state.conflict.deployedTroops.dennis).toBe(1)
    expect(player.strength).toBe(3)
  })

  test('can acquire cards with persuasion', () => {
    const game = t.fixture()
    game.run()

    // Dennis reveals all 5 cards for 6 persuasion
    t.choose(game, 'Reveal Turn')

    // Should be offered to acquire cards
    const choices = t.currentChoices(game)
    expect(choices).toContain('Pass')
    // Urgent Shigawire costs 2, should be available
    expect(choices).toContain('Urgent Shigawire')
  })

  test('acquiring a card goes to discard and refills row', () => {
    const game = t.fixture()
    game.run()

    t.choose(game, 'Reveal Turn')

    // Acquire Urgent Shigawire (cost 2)
    t.choose(game, 'Urgent Shigawire')

    // Card should be in discard
    const discard = game.zones.byId('dennis.discard')
    const acquired = discard.cardlist().find(c => c.name === 'Urgent Shigawire')
    expect(acquired).toBeTruthy()

    // Imperium Row should still have 5 cards (refilled)
    const row = game.zones.byId('common.imperiumRow')
    expect(row.cardlist().length).toBe(5)

    // Remaining persuasion = 6 - 2 = 4
    const player = game.players.byName('dennis')
    expect(player.getCounter('persuasion')).toBe(4)
  })

  test('clean up moves all cards to discard', () => {
    const game = t.fixture()
    game.run()

    t.choose(game, 'Reveal Turn')
    // Pass on acquiring
    t.choose(game, 'Pass')

    // After reveal turn completes, all 5 revealed cards should be in discard
    const discard = game.zones.byId('dennis.discard')
    expect(discard.cardlist().length).toBe(5)

    const hand = game.zones.byId('dennis.hand')
    expect(hand.cardlist().length).toBe(0)
  })
})
