const t = require('../testutil')

describe('Deck Building', () => {

  test('trashing a card removes it from the game', () => {
    const game = t.fixture()
    game.run()

    // Dennis has Seek Allies (agentAbility: "Trash this card") — but it's in the deck,
    // not the hand with this seed. Seek Allies has factionAccess: all 4 factions.
    // With seed 'test_seed', dennis hand: Dagger, CA, Diplomacy, CA, Recon
    // Seek Allies is in the deck. We can't trash via agent ability this round.

    // Instead, test the trash zone mechanism: send agent to a space that offers trash
    // Sword Master space (green) gives swordmaster but doesn't trash.
    // Let's verify trashing works by checking the trash zone after an acquire flow
    // that involves trashing. Or just verify the trash zone exists and is usable.

    const trashZone = game.zones.byId('common.trash')
    expect(trashZone.cardlist().length).toBe(0)

    // Use deckEngine directly to verify mechanism
    const deckEngine = require('../systems/deckEngine')
    const handZone = game.zones.byId('dennis.hand')
    const card = handZone.cardlist()[0]
    const cardName = card.name

    deckEngine.trashCard(game, card)

    expect(trashZone.cardlist().length).toBe(1)
    expect(trashZone.cardlist()[0].name).toBe(cardName)
    expect(handZone.cardlist().length).toBe(4)
  })

  test('reshuffle discard into deck when deck empty', () => {
    const game = t.fixture()
    game.run()

    const deckEngine = require('../systems/deckEngine')
    const player = game.players.byName('dennis')
    const deckZone = game.zones.byId('dennis.deck')
    const discardZone = game.zones.byId('dennis.discard')

    // Move all deck cards to discard to simulate empty deck
    for (const card of [...deckZone.cardlist()]) {
      card.moveTo(discardZone)
    }
    expect(deckZone.cardlist().length).toBe(0)
    expect(discardZone.cardlist().length).toBe(5)

    // Drawing should trigger reshuffle
    const drawn = deckEngine.drawCards(game, player, 2)
    expect(drawn).toBe(2)
    // Discard was reshuffled into deck, then 2 drawn to hand
    expect(deckZone.cardlist().length).toBe(3)
  })

  test('Swordmaster space grants 3rd agent', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 8 }, // Sword Master costs 8 Solari
    })
    game.run()

    const player = game.players.byName('dennis')
    expect(player.getCounter('hasSwordmaster')).toBe(0)

    // Dagger (green) → Sword Master (green, cost: 8 solari)
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dagger')

    const spaces = t.currentChoices(game)
    expect(spaces).toContain('Sword Master')
    t.choose(game, 'Sword Master')

    const updatedPlayer = game.players.byName('dennis')
    expect(updatedPlayer.getCounter('hasSwordmaster')).toBe(1)
    expect(updatedPlayer.solari).toBe(0) // paid 8
  })

  test('cannot visit Sword Master if already have swordmaster', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 8, hasSwordmaster: true },
    })
    game.run()

    t.choose(game, 'Agent Turn')
    t.choose(game, 'Dagger')

    const spaces = t.currentChoices(game)
    expect(spaces).not.toContain('Sword Master')
  })
})
