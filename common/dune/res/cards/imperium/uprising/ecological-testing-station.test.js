'use strict'

const t = require('../../../../testutil')
const card = require('./ecological-testing-station.js')

describe('ecological-testing-station', () => {
  test('data', () => {
    expect(card.id).toBe('ecological-testing-station')
    expect(card.name).toBe('Ecological Testing Station')
    expect(card.source).toBe('Uprising')
    expect(card.compatibility).toBe('All')
    expect(card.factionAccess).toEqual(['fremen'])
    expect(card.factionAffiliation).toBe('fremen')
  })

  test('agent ability: spends 2 Water, draws 2 cards', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Ecological Testing Station', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        water: 3,
      },
    })
    game.run()

    // Send to a purple space (Arrakeen is free).
    t.choose(game, 'Agent Turn.Ecological Testing Station')
    t.choose(game, 'Arrakeen')
    let choices = t.currentChoices(game)
    while (choices.includes('Ecological Testing Station') && choices.includes('Arrakeen')) {
      t.choose(game, 'Ecological Testing Station')
      choices = t.currentChoices(game)
    }
    // Pick the "2 Water -> Draw 2 cards" option from the choice prompt.
    const payChoice = choices.find(c => /Water.*Draw/i.test(c))
    expect(payChoice).toBeTruthy()
    t.choose(game, payChoice)
    choices = t.currentChoices(game)
    const deployZero = choices.find(c => /Deploy 0 troop/.test(c))
    if (deployZero) {
      t.choose(game, deployZero)
    }

    const dennis = game.players.byName('dennis')
    // Started 3 water, paid 2 for the agent ability.
    expect(dennis.water).toBe(1)
    // Hand: started 5, played card (-1), drew 2 (card ability) + 1 (Arrakeen) = 7
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(7)
  })

  test('agent ability: insufficient Water — ability does not fire', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Ecological Testing Station', 'Dagger', 'Diplomacy', 'Convincing Argument', 'Reconnaissance'],
        water: 1,
      },
    })
    game.run()

    t.choose(game, 'Agent Turn.Ecological Testing Station')
    t.choose(game, 'Arrakeen')
    let choices = t.currentChoices(game)
    while (choices.includes('Ecological Testing Station') && choices.includes('Arrakeen')) {
      t.choose(game, 'Ecological Testing Station')
      choices = t.currentChoices(game)
    }
    const deployZero = choices.find(c => /Deploy 0 troop/.test(c))
    if (deployZero) {
      t.choose(game, deployZero)
    }

    const dennis = game.players.byName('dennis')
    expect(dennis.water).toBe(1) // unchanged
    // No card-ability draw; only Arrakeen drew 1. Hand: 5 - 1 (played) + 1 (Arrakeen) = 5
    expect(game.zones.byId('dennis.hand').cardlist().length).toBe(5)
  })

  test('reveal: Fremen Bond gives +1 Water when another Fremen card is revealed', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Ecological Testing Station', 'Desert Survival'],
        water: 1,
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // Bond fires (Desert Survival is Fremen) → +1 Water
    expect(dennis.water).toBe(2)
    // Persuasion: ETS(1) + Desert Survival(1) = 2
    expect(dennis.getCounter('persuasion')).toBe(2)
  })

  test('reveal: Fremen Bond does not fire alone', () => {
    const game = t.fixture()
    t.setBoard(game, {
      dennis: {
        handExact: ['Ecological Testing Station', 'Dagger'],
        water: 1,
      },
    })
    game.run()

    t.choose(game, 'Reveal Turn')

    const dennis = game.players.byName('dennis')
    // No bond; water unchanged.
    expect(dennis.water).toBe(1)
  })
})
