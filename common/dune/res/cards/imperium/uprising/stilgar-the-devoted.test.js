'use strict'

const t = require('../../../../testutil')
const card = require('./stilgar-the-devoted.js')

// Replace dennis's hand with the named cards. Cards are pulled from imperium
// deck, player deck, or discard (in that order). Original hand cards land in
// discard so they don't interfere with the reveal.
function setHand(game, cardNames) {
  game.testSetBreakpoint('after-round-start', (g) => {
    const hand = g.zones.byId('dennis.hand')
    const discard = g.zones.byId('dennis.discard')
    const imperiumDeck = g.zones.byId('common.imperiumDeck')
    const playerDeck = g.zones.byId('dennis.deck')

    for (const c of [...hand.cardlist()]) {
      c.moveTo(discard)
    }
    for (const name of cardNames) {
      let c = imperiumDeck.cardlist().find(x => x.name === name)
      if (!c) {
        c = playerDeck.cardlist().find(x => x.name === name)
      }
      if (!c) {
        c = discard.cardlist().find(x => x.name === name)
      }
      if (!c) {
        throw new Error(`Card "${name}" not found`)
      }
      c.moveTo(hand)
    }
  })
}

// Pre-populate a player's played zone with named cards from the imperium deck,
// simulating cards played as agents earlier in the round.
function setPlayed(game, playerName, cardNames) {
  game.testSetBreakpoint('after-round-start', (g) => {
    const played = g.zones.byId(`${playerName}.played`)
    const imperiumDeck = g.zones.byId('common.imperiumDeck')
    for (const name of cardNames) {
      const c = imperiumDeck.cardlist().find(x => x.name === name)
      if (!c) {
        throw new Error(`Card "${name}" not in imperium deck`)
      }
      c.moveTo(played)
    }
  })
}

describe('Stilgar, The Devoted', () => {

  test('data', () => {
    expect(card.id).toBe('stilgar-the-devoted')
    expect(card.name).toBe('Stilgar, The Devoted')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAffiliation).toBe('fremen')
  })

  test('reveal alone gives +2 persuasion (counts itself)', () => {
    const game = t.fixture()
    // Hand: Stilgar + 4 non-Fremen starter cards (none have factionAffiliation)
    setHand(game, ['Stilgar, The Devoted', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'])
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Base reveal: Stilgar(2) + Dagger(0) + Diplomacy(1) + CA(2) + Recon(1) = 6
    // Stilgar bonus: 1 Fremen × 2 = 2
    expect(dennis.getCounter('persuasion')).toBe(8)
  })

  test('reveal with one other Fremen card gives +4 bonus', () => {
    const game = t.fixture()
    setHand(game, ['Stilgar, The Devoted', 'Desert Survival', 'Dagger', 'Diplomacy', 'Reconnaissance'])
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Base reveal: Stilgar(2) + Desert Survival(1) + Dagger(0) + Diplomacy(1) + Recon(1) = 5
    // Stilgar bonus: 2 Fremen × 2 = 4
    expect(dennis.getCounter('persuasion')).toBe(9)
  })

  test('reveal with two other Fremen cards gives +6 bonus', () => {
    const game = t.fixture()
    setHand(game, ['Stilgar, The Devoted', 'Desert Survival', 'Maula Pistol', 'Diplomacy', 'Reconnaissance'])
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Base reveal: Stilgar(2) + Desert Survival(1) + Maula Pistol(1) + Diplomacy(1) + Recon(1) = 6
    // Stilgar bonus: 3 Fremen × 2 = 6
    expect(dennis.getCounter('persuasion')).toBe(12)
  })

  test('counts a Fremen card already played as an agent this round', () => {
    const game = t.fixture()
    setHand(game, ['Stilgar, The Devoted', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'])
    setPlayed(game, 'dennis', ['Desert Survival'])
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Base reveal: Stilgar(2) + Dagger(0) + Diplomacy(1) + CA(2) + Recon(1) = 6
    // Stilgar bonus: 2 Fremen (Stilgar revealed + Desert Survival in played) × 2 = 4
    expect(dennis.getCounter('persuasion')).toBe(10)
  })

  test('counts Fremen cards across both played and revealed zones', () => {
    const game = t.fixture()
    setHand(game, ['Stilgar, The Devoted', 'Maula Pistol', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'])
    setPlayed(game, 'dennis', ['Desert Survival'])
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Base reveal: Stilgar(2) + Maula Pistol(1) + Diplomacy(1) + CA(2) + Recon(1) = 7
    // Stilgar bonus: 3 Fremen (Stilgar + Maula Pistol revealed, Desert Survival played) × 2 = 6
    expect(dennis.getCounter('persuasion')).toBe(13)
  })

  test('does not count opponent\'s Fremen cards in their played zone', () => {
    const game = t.fixture()
    setHand(game, ['Stilgar, The Devoted', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'])
    setPlayed(game, 'micah', ['Desert Survival'])
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Base reveal: Stilgar(2) + Dagger(0) + Diplomacy(1) + CA(2) + Recon(1) = 6
    // Stilgar bonus: 1 Fremen (only Stilgar — micah's card doesn't count) × 2 = 2
    expect(dennis.getCounter('persuasion')).toBe(8)
  })

  test('non-Fremen cards in revealed hand do not contribute to bonus', () => {
    const game = t.fixture()
    // Southern Elders is bene-gesserit, not fremen (factionAccess fremen but
    // factionAffiliation is bene-gesserit) — should NOT count.
    setHand(game, ['Stilgar, The Devoted', 'Southern Elders', 'Dagger', 'Diplomacy', 'Reconnaissance'])
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Base reveal: Stilgar(2) + Southern Elders(0, +1 water side effect) + Dagger(0) + Diplomacy(1) + Recon(1) = 4
    // Stilgar bonus: 1 Fremen (only itself) × 2 = 2
    // Note: Southern Elders has Fremen Bond which DOES fire here (Stilgar is a
    // Fremen card revealed alongside it) — adds +2 persuasion.
    expect(dennis.getCounter('persuasion')).toBe(8)
  })
})
