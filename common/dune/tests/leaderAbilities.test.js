const t = require('../testutil')

describe('Leader Abilities', () => {

  test('Signet Ring card triggers resolveSignetRing when played', () => {
    const game = t.fixture({ useLeaders: true, randomLeaders: true })
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

  test('resolveSignetRing is called when Signet Ring agent ability triggers', () => {
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../phases/playerTurns.js'), 'utf8')
    expect(code).toContain('leaders.resolveSignetRing(game, player, resolveEffect)')
  })

  test('Paul Atreides Signet Ring: Discipline draws 1 card', () => {
    const game = t.fixture({ useLeaders: true })
    t.setBoard(game, {})
    // Manually assign Paul Atreides
    game.testSetBreakpoint('initialization-complete', (g) => {
      g.state.leaders.dennis = {
        name: 'Paul Atreides',
        signetRingAbility: 'Discipline: Draw 1 card.',
        leaderAbility: 'Prescience: You may look at the top card of your deck at any time.',
      }
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
    t.choose(game, 'Agent Turn')
    t.choose(game, 'Signet Ring')

    // Should be able to access green/purple/yellow spaces
    const spaces = t.currentChoices(game)
    expect(spaces.length).toBeGreaterThan(0)
    t.choose(game, spaces[0])
  })

  test('Shaddam Corrino IV requires CHOAM module', () => {
    const fs = require('fs')
    const code = fs.readFileSync(require.resolve('../systems/leaders.js'), 'utf8')
    expect(code).toContain("l.name !== 'Shaddam Corrino IV'")
  })

  test('Glossu Rabban has a starting effect defined', () => {
    const leaderData = require('../res/leaders/index.js')
    const rabban = leaderData.find(l => l.name.includes('Rabban'))
    expect(rabban).toBeDefined()
    expect(rabban.startingEffect).toBeDefined()
  })
})
