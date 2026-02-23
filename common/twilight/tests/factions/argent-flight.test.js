const t = require('../../testutil.js')


describe('Argent Flight', () => {
  test('votes first with extra votes', () => {
    const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
    game.run()

    const votingOrder = game.players.all()
    const participation = game.factionAbilities.getAgendaParticipation(votingOrder)

    // Argent should be first in order
    expect(participation.order[0].faction.id).toBe('argent-flight')

    // Argent gets +playerCount votes
    const argent = game.players.byName('dennis')
    const modifier = game.factionAbilities.getVotingModifier(argent)
    expect(modifier).toBe(2) // 2 players
  })

  test('excess AFB hits damage sustain ships', () => {
    // Test getRaidFormationExcessHits directly
    const game = t.fixture({ factions: ['argent-flight', 'emirates-of-hacan'] })
    game.run()

    // 3 AFB hits, 1 fighter destroyed = 2 excess
    const excess = game.factionAbilities.getRaidFormationExcessHits('dennis', 3, 1)
    expect(excess).toBe(2)

    // Non-Argent gets 0
    const noExcess = game.factionAbilities.getRaidFormationExcessHits('micah', 3, 1)
    expect(noExcess).toBe(0)
  })
})
