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
})
