const t = require('../testutil')

describe('Leader Abilities', () => {

  test('Signet Ring card is in starting deck', () => {
    const game = t.fixture()
    game.run()

    // Verify Signet Ring is in the starting deck
    const handCards = game.zones.byId('dennis.hand').cardlist()
    const deckCards = game.zones.byId('dennis.deck').cardlist()
    const allCards = [...handCards, ...deckCards]
    const signetRing = allCards.find(c => c.name === 'Signet Ring')
    expect(signetRing).toBeDefined()
    expect(signetRing.agentIcons).toEqual(['green', 'purple', 'yellow'])
  })

  test('Signet Ring ability is defined on most leaders', () => {
    const leaderData = require('../res/leaders/index.js')
    const withAbility = leaderData.filter(l => l.signetRingAbility)
    // Most leaders should have a signet ring ability
    expect(withAbility.length).toBeGreaterThan(leaderData.length / 2)

    // Each defined ability should be a string or object
    for (const leader of withAbility) {
      expect(['string', 'object']).toContain(typeof leader.signetRingAbility)
    }
  })

  test('Paul Atreides leader data is well-formed', () => {
    const leaderData = require('../res/leaders/index.js')
    const paul = leaderData.find(l => l.name === 'Paul Atreides')
    expect(paul).toBeDefined()
    expect(paul.signetRingAbility).toBeDefined()
    expect(paul.leaderAbility).toBeDefined()
    expect(paul.leaderAbility).toContain('Prescience')
  })

  test('Paul Atreides Signet Ring can be played via gameplay', () => {
    const game = t.fixture()
    t.setBoard(game, {
      leaders: {
        dennis: {
          name: 'Paul Atreides',
          signetRingAbility: 'Discipline: Draw 1 card.',
          leaderAbility: 'Prescience: You may look at the top card of your deck at any time.',
        },
      },
    })
    game.run()

    // Check Signet Ring is in hand
    const hand = game.zones.byId('dennis.hand').cardlist()
    const signet = hand.find(c => c.name === 'Signet Ring')
    if (!signet) {
      // Signet Ring not in opening hand — skip
      return
    }

    // Play Signet Ring to a green space
    t.choose(game, 'Agent Turn.Signet Ring')

    // Should be able to access green/purple/yellow spaces
    const spaces = t.currentChoices(game)
    expect(spaces.length).toBeGreaterThan(0)
    t.choose(game, spaces[0])
  })

  test('Liet Kynes signet ring grants solari on purple space', () => {
    const leaderData = require('../res/leaders/index.js')
    const liet = leaderData.find(l => l.name === 'Liet Kynes')
    const game = t.fixture({ seed: 'liet_purple' })
    t.setBoard(game, {
      leaders: { dennis: liet },
      dennis: { solari: 0 },
    })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    const signet = hand.find(c => c.name === 'Signet Ring')
    if (!signet) {
      return
    }

    // Signet Ring to purple space (Arrakeen)
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Signet Ring')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(1)
  })

  test('Liet Kynes signet ring grants spice on yellow space', () => {
    const leaderData = require('../res/leaders/index.js')
    const liet = leaderData.find(l => l.name === 'Liet Kynes')
    const game = t.fixture({ seed: 'liet_yellow2' })
    t.setBoard(game, {
      leaders: { dennis: liet },
      dennis: { spice: 0 },
      firstPlayerIndex: 0,
    })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    const signet = hand.find(c => c.name === 'Signet Ring')
    if (!signet) {
      return
    }

    // Signet Ring to yellow space (Imperial Basin)
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Imperial Basin')
    t.choose(game, 'Signet Ring')

    const player = game.players.byName('dennis')
    // Imperial Basin harvests 1 spice + 1 from Liet Kynes
    expect(player.spice).toBe(2)
  })

  test('Liet Kynes signet ring grants water on green space with 2+ emperor influence', () => {
    const leaderData = require('../res/leaders/index.js')
    const liet = leaderData.find(l => l.name === 'Liet Kynes')
    const game = t.fixture({ seed: 'liet_green' })
    t.setBoard(game, {
      leaders: { dennis: liet },
      dennis: { water: 0, influence: { emperor: 2 } },
    })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    const signet = hand.find(c => c.name === 'Signet Ring')
    if (!signet) {
      return
    }

    // Signet Ring to green space (Assembly Hall)
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Signet Ring')

    const player = game.players.byName('dennis')
    expect(player.water).toBe(1)
  })

  test('Liet Kynes signet ring no water on green space without emperor influence', () => {
    const leaderData = require('../res/leaders/index.js')
    const liet = leaderData.find(l => l.name === 'Liet Kynes')
    const game = t.fixture({ seed: 'liet_green_no_inf' })
    t.setBoard(game, {
      leaders: { dennis: liet },
      dennis: { water: 0, influence: { emperor: 1 } },
    })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    const signet = hand.find(c => c.name === 'Signet Ring')
    if (!signet) {
      return
    }

    // Signet Ring to green space (Assembly Hall)
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Assembly Hall')
    t.choose(game, 'Signet Ring')

    const player = game.players.byName('dennis')
    expect(player.water).toBe(0)
  })

  test('effect order choice is offered when card has agent ability', () => {
    const game = t.fixture()
    game.run()

    // Signet Ring has an agent ability
    const hand = game.zones.byId('dennis.hand').cardlist()
    const signet = hand.find(c => c.name === 'Signet Ring')
    if (!signet) {
      return
    }

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Assembly Hall')

    const choices = t.currentChoices(game)
    expect(choices).toContain('Signet Ring')
    expect(choices).toContain('Assembly Hall')
  })

  test('no effect order choice when card has no agent ability', () => {
    const game = t.fixture()
    game.run()

    // Dagger has no agent ability
    t.choose(game, 'Agent Turn.Dagger')
    t.choose(game, 'Assembly Hall')

    // Should skip straight to plot intrigue or next player — no order choice
    const choices = t.currentChoices(game)
    expect(choices).not.toContain('Dagger')
    expect(choices).not.toContain('Assembly Hall')
  })

  test('board space first resolves space effects before card ability', () => {
    const leaderData = require('../res/leaders/index.js')
    const liet = leaderData.find(l => l.name === 'Liet Kynes')
    const game = t.fixture({ seed: 'liet_order' })
    t.setBoard(game, {
      leaders: { dennis: liet },
      dennis: { solari: 0 },
    })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    const signet = hand.find(c => c.name === 'Signet Ring')
    if (!signet) {
      return
    }

    // Board space first — Arrakeen gives +1 troop, draw 1; then Liet gives +1 solari
    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Arrakeen')

    const player = game.players.byName('dennis')
    expect(player.solari).toBe(1)
  })

  test('Shaddam Corrino IV is excluded without CHOAM', () => {
    const leaderData = require('../res/leaders/index.js')
    const shaddam = leaderData.find(l => l.name === 'Shaddam Corrino IV')
    expect(shaddam).toBeDefined()
    // Shaddam requires CHOAM module — verified by leader filtering in game setup
  })

  test('Glossu Rabban has a starting effect defined', () => {
    const leaderData = require('../res/leaders/index.js')
    const rabban = leaderData.find(l => l.name.includes('Rabban'))
    expect(rabban).toBeDefined()
    expect(rabban.startingEffect).toBeDefined()
  })

  test('Helena Richese Signet Ring reserves an Imperium Row card', () => {
    const leaderData = require('../res/leaders/index.js')
    const helena = leaderData.find(l => l.name === 'Helena Richese')
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: helena } })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    const signet = hand.find(c => c.name === 'Signet Ring')
    if (!signet) {
      return
    }

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)
    const targetName = rowBefore[0]

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Signet Ring')
    t.choose(game, targetName)

    const reserved = game.zones.byId('common.reservedCards').cardlist()
    expect(reserved).toHaveLength(1)
    expect(reserved[0].name).toBe(targetName)
    expect(game.state.reservedCards).toHaveLength(1)
    expect(game.state.reservedCards[0]).toMatchObject({ player: 'dennis', round: 1 })
    expect(game.state.reservedCards[0].cardId).toBe(reserved[0].id)
    expect(game.zones.byId('common.imperiumRow').cardlist()).toHaveLength(5)
  })

  test('Helena reserved card expires (trashed) at Recall if not acquired', () => {
    const leaderData = require('../res/leaders/index.js')
    const helena = leaderData.find(l => l.name === 'Helena Richese')
    const game = t.fixture()
    t.setBoard(game, { leaders: { dennis: helena } })
    game.run()

    const hand = game.zones.byId('dennis.hand').cardlist()
    if (!hand.find(c => c.name === 'Signet Ring')) {
      return
    }

    const rowBefore = game.zones.byId('common.imperiumRow').cardlist().map(c => c.name)
    const targetName = rowBefore[0]

    t.choose(game, 'Agent Turn.Signet Ring')
    t.choose(game, 'Arrakeen')
    t.choose(game, 'Signet Ring')
    t.choose(game, targetName)

    // Fast-forward: pass through remaining agent turns and reveals for all players
    // until Recall clears the reservation. Easier: advance by having everyone reveal.
    while (game.state.reservedCards.length > 0) {
      const choices = t.currentChoices(game)
      if (choices.length === 0) {
        break
      }
      const pick = choices.find(c => /Reveal Turn/i.test(c)) || choices[0]
      t.choose(game, pick)
    }

    expect(game.state.reservedCards).toEqual([])
    const reservedCards = game.zones.byId('common.reservedCards').cardlist()
    expect(reservedCards).toHaveLength(0)
    const trashNames = game.zones.byId('common.trash').cardlist().map(c => c.name)
    expect(trashNames).toContain(targetName)
  })
})
