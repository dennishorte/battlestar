const t = require('../../testutil.js')

function pickStrategyCards(game, dennisCard, micahCard) {
  t.choose(game, dennisCard)
  t.choose(game, micahCard)
}

describe('Nekro Virus', () => {
  test('cannot research technology normally', () => {
    const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
    game.run()

    const dennis = game.players.byName('dennis')
    expect(game.factionAbilities.canResearchNormally(dennis)).toBe(false)

    const micah = game.players.byName('micah')
    expect(game.factionAbilities.canResearchNormally(micah)).toBe(true)
  })

  test('is excluded from agenda voting', () => {
    const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
    game.run()

    const votingOrder = game.players.all()
    const participation = game.factionAbilities.getAgendaParticipation(votingOrder)
    expect(participation.excluded).toContain('dennis')
    expect(participation.excluded).not.toContain('micah')
  })

  test('gains tech when opponent unit destroyed in combat', () => {
    const game = t.fixture({ factions: ['nekro-virus', 'emirates-of-hacan'] })
    t.setBoard(game, {
      dennis: {
        units: {
          'nekro-home': {
            space: ['cruiser', 'cruiser', 'cruiser', 'cruiser', 'cruiser'],
            'mordai-ii': ['space-dock'],
          },
        },
      },
      micah: {
        units: {
          '27': {
            space: ['fighter'],
          },
        },
      },
    })
    game.run()
    pickStrategyCards(game, 'leadership', 'diplomacy')

    t.choose(game, 'Tactical Action')
    t.action(game, 'activate-system', { systemId: '27' })
    t.action(game, 'move-ships', {
      movements: [{ unitType: 'cruiser', from: 'nekro-home', count: 5 }],
    })

    // Nekro destroys Hacan fighter — Technological Singularity triggers
    // Choose a tech from Hacan (antimass-deflectors or sarween-tools)
    t.choose(game, 'antimass-deflectors')

    const dennis = game.players.byName('dennis')
    expect(dennis.hasTechnology('antimass-deflectors')).toBe(true)
  })
})
