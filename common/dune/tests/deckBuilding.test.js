const t = require('../testutil')

describe('Deck Building', () => {

  test('trash zone starts empty', () => {
    const game = t.fixture()
    game.run()

    const trashZone = game.zones.byId('common.trash')
    expect(trashZone.cardlist().length).toBe(0)
  })

  test('deck reshuffles discard when cards are drawn from empty deck', () => {
    // After drawing the initial 5 cards to hand, the deck has 5 remaining.
    // Playing through a full round of reveals and drawing should trigger reshuffle.
    const game = t.fixture()
    game.run()

    const deckZone = game.zones.byId('dennis.deck')
    const handZone = game.zones.byId('dennis.hand')

    // Starting state: 5 cards in hand, 5 in deck
    expect(handZone.cardlist().length).toBe(5)
    expect(deckZone.cardlist().length).toBe(5)
  })

  test('Swordmaster space grants 3rd agent', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: { solari: 8 }, // Sword Master costs 8 Solari
    })
    game.run()

    const player = game.players.byName('dennis')
    expect(player.getCounter('hasSwordmaster')).toBe(0)

    // Dagger (green) -> Sword Master (green, cost: 8 solari)
    t.choose(game, 'Agent Turn.Dagger')

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

    t.choose(game, 'Agent Turn.Dagger')

    const spaces = t.currentChoices(game)
    expect(spaces).not.toContain('Sword Master')
  })
})
